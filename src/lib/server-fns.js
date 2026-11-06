import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Reads a secret from process.env (Node / Cloudflare nodejs_compat) or import.meta.env.
// Vite only exposes VITE_-prefixed .env values through import.meta.env, so for local
// development we also accept VITE_<NAME>. In production prefer the plain name as a host secret.
function getEnv(name) {
  try {
    if (typeof process !== "undefined") {
      if (process.env?.[name]) return process.env[name];
      if (process.env?.[`VITE_${name}`]) return process.env[`VITE_${name}`];
    }
  } catch {
    /* ignore */
  }
  try {
    return import.meta.env?.[name] || import.meta.env?.[`VITE_${name}`] || "";
  } catch {
    return "";
  }
}

/* ------------------------------------------------------------------ */
/* Inquiries                                                           */
/* ------------------------------------------------------------------ */

const InquiryInput = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().max(200).optional(),
  service: z.string().max(100).optional(),
  message: z.string().max(1500).optional(),
});

// Stores inquiries in memory (no external DB).
const inquiries = [];

export const createInquiry = createServerFn({ method: "POST" })
  .validator(InquiryInput)
  .handler(({ data }) => {
    inquiries.push({ ...data, createdAt: new Date().toISOString() });
    return data;
  });

/* ------------------------------------------------------------------ */
/* AI Astrologer (Gemini)                                              */
/* ------------------------------------------------------------------ */

const specialistFocus = {
  career: "career, job changes, promotions, workplace harmony and professional timing",
  wealth: "long-term wealth accumulation, savings, ancestral property and Dhana Yogas",
  money: "liquid cash flow, debts, loan clearances and month-to-month finances",
  health: "vitality, constitution, energetic cycles and periods requiring remedial care",
  love: "romance, heart compatibility, relationship friction and reconciliation",
  marriage: "horoscope matching, marriage timing, married life harmony and Manglik analysis",
  birth: "comprehensive Janma Kundli reading, Lagna, Nakshatras, Mahadasha and Raja Yogas",
  business: "partnerships, commercial expansion, venture launch Muhurat and business Vastu",
  education: "studies, competitive examinations, foreign education prospects and stream selection",
  vastu: "directional energy alignment, entrances, room placements and non-demolition remedies",
};

const AiChatInput = z.object({
  specialist: z.enum([
    "career",
    "wealth",
    "money",
    "health",
    "love",
    "marriage",
    "birth",
    "business",
    "education",
    "vastu",
  ]),
  chart: z.string().max(3000).optional(),
  name: z.string().max(120).optional(),
  lang: z.enum(["en", "hi"]).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(60),
});

// Gemini 2.0 is retired and 2.5 is restricted to existing users, so use the Gemini 3.x models.
// Google retires models often: check https://ai.google.dev/gemini-api/docs/models for current IDs.
// Fastest first: Flash-Lite is built for low latency; the full Flash models are fallbacks.
const GEMINI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-3.7-flash"];

/**
 * Calls Gemini with a system instruction and proper role history.
 * Returns { text } on success or { error } with the reason (logged to the server console).
 */
async function callGemini({ system, messages, apiKey }) {
  if (!apiKey) return { error: "GEMINI_API_KEY is not set on the server" };

  // Gemini uses "model" (not "assistant"), history must start with "user",
  // and consecutive same-role turns are merged.
  const contents = [];
  for (const m of messages) {
    const role = m.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n${m.content}`;
    } else {
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }
  while (contents.length && contents[0].role !== "user") contents.shift();
  if (!contents.length) return { error: "No user message to send" };

  const errors = [];
  const RETRYABLE = new Set([429, 500, 502, 503, 504]);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  // Never hang: each request is aborted after 10s and Gemini gets ~14s in total, then the backup provider takes over.
  const deadline = Date.now() + 14000;

  for (const model of GEMINI_MODELS) {
    let useThinkingCfg = true; // low reasoning effort = much faster answers
    // Temporary overloads (503) are common on free keys: retry each model a few times.
    for (let attempt = 1; attempt <= 2; attempt++) {
      if (Date.now() > deadline) {
        errors.push("Timed out after trying several times (Gemini is slow or overloaded)");
        return { error: errors.join("\n") };
      }
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            signal: AbortSignal.timeout(10000),
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: system }] },
              contents,
              generationConfig: {
                // Gemini 3 models always "think" first and that counts toward this limit,
                // so keep it generous to avoid cut-off or empty answers.
                maxOutputTokens: 2048,
                temperature: 0.75,
                topP: 0.95,
                ...(useThinkingCfg ? { thinkingConfig: { thinkingLevel: "low" } } : {}),
              },
            }),
          }
        );

        if (!res.ok) {
          const body = (await res.text()).slice(0, 300);
          const msg = `${model} (try ${attempt}) -> HTTP ${res.status}: ${body}`;
          errors.push(msg);
          console.error("[Gemini]", msg);
          // If this model rejects the thinking option, retry it once without that option.
          if (res.status === 400 && useThinkingCfg && /think/i.test(body)) {
            useThinkingCfg = false;
            attempt -= 1;
            continue;
          }
          if (RETRYABLE.has(res.status) && attempt < 2) {
            await sleep(attempt * 1200);
            continue; // retry same model
          }
          break; // non-retryable (404, 400, ...) or out of retries: next model
        }

        const json = await res.json();
        const text = (json?.candidates?.[0]?.content?.parts || [])
          .map((p) => p.text || "")
          .join("")
          .trim();

        if (text) return { text };

        const emptyMsg = `${model} -> empty response (finishReason: ${json?.candidates?.[0]?.finishReason || json?.promptFeedback?.blockReason || "unknown"})`;
        errors.push(emptyMsg);
        console.error("[Gemini]", emptyMsg);
        break;
      } catch (err) {
        const netMsg = `${model} (try ${attempt}) -> network error/timeout: ${err?.message || err}`;
        errors.push(netMsg);
        console.error("[Gemini]", netMsg);
        if (attempt < 2) {
          await sleep(attempt * 1200);
          continue;
        }
        break;
      }
    }
  }

  return { error: errors.join("\n") || "Unknown error" };
}

/**
 * Backup provider: Groq (free tier, OpenAI-compatible). Used when Gemini is overloaded or fails.
 * Returns { text } on success or { error } with the reason.
 */
// Groq retired the Llama 3.3 / 3.1 models for free keys on 2026-08-16; these are the replacements.
// Check https://console.groq.com/docs/models if a model ID stops working.
const GROQ_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"];

async function callGroq({ system, messages, apiKey }) {
  if (!apiKey) return { error: "GROQ_API_KEY is not set on the server" };

  const chat = messages.map((m) => ({ role: m.role, content: m.content }));
  while (chat.length && chat[0].role !== "user") chat.shift();
  if (!chat.length) return { error: "No user message to send" };

  const errors = [];

  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: system }, ...chat],
          temperature: 0.75,
          // reasoning models count their hidden thinking toward this limit
          max_completion_tokens: 3000,
          // low reasoning effort = faster answers (supported by the gpt-oss models)
          ...(model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
        }),
      });

      if (!res.ok) {
        const body = (await res.text()).slice(0, 300);
        const msg = `[groq] ${model} -> HTTP ${res.status}: ${body}`;
        errors.push(msg);
        console.error(msg);
        continue;
      }

      const json = await res.json();
      const text = (json?.choices?.[0]?.message?.content || "").trim();
      if (text) return { text };

      const emptyMsg = `[groq] ${model} -> empty response`;
      errors.push(emptyMsg);
      console.error(emptyMsg);
    } catch (err) {
      const netMsg = `[groq] ${model} -> network error/timeout: ${err?.message || err}`;
      errors.push(netMsg);
      console.error(netMsg);
    }
  }

  return { error: errors.join("\n") || "Unknown Groq error" };
}

export const askAstrologer = createServerFn({ method: "POST" })
  .validator(AiChatInput)
  .handler(async ({ data }) => {
  const focus = specialistFocus[data.specialist] || data.specialist;
  const isHi = data.lang === "hi";

  const chartDescription = data.chart
    ? `The seeker's Janma Kundli details: ${data.chart}. Integrate these exact placements (Lagna, Rashi, Nakshatra, active Dasha) specifically into your analysis.`
    : "No birth chart has been linked yet. Give readings grounded in universal Vedic astrology principles (Bhavas, Grahas, transits) and advise the seeker to generate their free Kundli on Vastugrah for pinpoint accuracy.";

  const defaultLang = isHi ? "Hindi in Devanagari script" : "English";
  const languageInstruction = `Reply in the same language and script as the seeker's LATEST message:
   - If they write Hinglish (Hindi words typed in English/Roman letters, e.g. "mujhe kya nhi krna chahiye"), reply in natural, friendly Hinglish in Roman letters. Do not switch to Devanagari. Keep astrological terms familiar (Lagna, Rashi, Dasha, Upaya, Shukra, Shani).
   - If they write in Devanagari Hindi, reply in fluent, respectful Hindi in Devanagari.
   - If they write in English, reply in warm, articulate English.
   - If the message is a greeting or unclear, use ${defaultLang}.
   Keep the same respectful, spiritual tone in every language.`;

  const system = `You are a revered, senior Vedic Astrologer (Acharya) at Vastugrah in Faridabad, Haryana, specializing in ${focus}.

${chartDescription}
${data.name ? `Seeker's name: ${data.name}. Greet them respectfully only in your first reply of the conversation, not in every reply.` : ""}

Consultation guidelines:
1. Answer the seeker's latest question directly. For substantive questions give a thoughtful reply of roughly 150 to 250 words in 2 to 3 short paragraphs. For greetings or very short messages (like "hi"), reply briefly and warmly and invite them to ask their question.
2. Use authentic Jyotish fundamentals: relevant Bhavas (houses), governing Grahas and transits.
3. If chart placements are provided, weave them into the reading.
4. Give realistic astrological timing where relevant.
5. When giving advice, include 1 to 2 traditional, practical Upayas (auspicious days, colors, directions, a mantra, or Daan).
6. Be encouraging and spiritually uplifting. Never predict death, fatal accidents, or give medical diagnoses. For health topics, remind them to consult a doctor.
7. ${languageInstruction}
8. Use plain text with clear paragraph breaks. Do not use markdown headings or tables.
9. Do not repeat earlier answers; continue the conversation naturally using the previous messages.
10. For any real question or reading (NOT for simple greetings or small talk), end your reply with one short, warm closing line inviting the seeker to consult our human astrologer at Vastugrah for a deeper, personal reading, and tell them to tap the WhatsApp chat button shown below your message. Write this line in the same language as your reply. Do not mention the button for greetings.`;

  const recent = data.messages.slice(-10);

  const allErrors = [];

  // 1) Gemini (best Hindi quality)
  const gemini = await callGemini({ system, messages: recent, apiKey: getEnv("GEMINI_API_KEY") });
  if (gemini.text) return { reply: gemini.text };
  allErrors.push(gemini.error);

  // 2) Groq backup when Gemini is overloaded or failing
  const groq = await callGroq({ system, messages: recent, apiKey: getEnv("GROQ_API_KEY") });
  if (groq.text) return { reply: groq.text };
  allErrors.push(groq.error);

  const result = { error: allErrors.join("\n") };

  // Honest fallback (no canned readings). Real reason is in the server logs.
  // In local development the reason is also shown in the chat bubble.
  const friendly = isHi
    ? "क्षमा करें, ज्योतिषी इस समय उत्तर नहीं दे पा रहे हैं। कृपया कुछ क्षण बाद पुनः प्रयास करें।"
    : "Sorry, the astrologer couldn't answer just now. Please try again in a moment.";
  return {
    reply: import.meta.env?.DEV ? `${friendly}\n\n[dev debug] ${result.error}` : friendly,
  };
});

/* ------------------------------------------------------------------ */
/* FreeAstrologyAPI proxy                                              */
/* ------------------------------------------------------------------ */

export const callAstroApi = createServerFn({ method: "POST" })
  .validator(
    z.object({
      endpoint: z.string().min(1),
      payload: z.record(z.any()).optional(),
    })
  )
  .handler(async ({ data }) => {
  const apiKey = getEnv("FREE_ASTRO_API_KEY");
  if (!apiKey) return { error: "FREE_ASTRO_API_KEY is not set on the server" };

  const endpoint = data.endpoint.startsWith("/") ? data.endpoint.slice(1) : data.endpoint;
  try {
    const res = await fetch(`https://json.freeastrologyapi.com/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; VastugrahBot/1.0)",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(data.payload || {}),
    });

    if (!res.ok) {
      const body = (await res.text().catch(() => "")).slice(0, 200);
      console.error(`[AstroAPI] ${endpoint} -> HTTP ${res.status}: ${body}`);
      return { error: `FreeAstrologyAPI error: ${res.status} ${body}`.trim() };
    }

    return await res.json();
  } catch (err) {
    console.error("Free Astro API error:", err);
    return { error: err.message };
  }
});