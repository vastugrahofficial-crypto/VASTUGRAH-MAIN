import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
/* AI astrologer chat (Gemini)                                         */
/* ------------------------------------------------------------------ */

const specialistFocus = {
  career: "career, job changes, promotions and workplace timing",
  wealth: "long-term wealth, savings, property and dhana yogas",
  money: "cash flow, debts, loans and monthly finances",
  health: "constitution, energy cycles and periods needing care",
  love: "romance, compatibility and reconciliation",
  marriage: "marriage matching, timing and married life",
  birth: "reading the kundli, lagna, nakshatra, dashas and yogas",
  business: "partnerships, expansion, launch timing and business Vastu",
  education: "studies, exams, foreign education and career streams",
  vastu: "rooms, directions, entrances and non-demolition Vastu remedies",
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
  chart: z.string().max(600).optional(),
  name: z.string().max(80).optional(),
  lang: z.enum(["en", "hi"]).optional(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(1000) }))
    .min(1)
    .max(10),
});

const FALLBACK_REPLY = "Let me look at this again — could you rephrase your question in one line?";

export const askAstrologer = createServerFn({ method: "POST" })
  .validator(AiChatInput)
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return { reply: "The astrologer is unavailable right now. Please try again shortly." };
    }

    const focus = specialistFocus[data.specialist];
    const chart = data.chart
      ? `The visitor's already-generated birth chart: ${data.chart}. Use these exact placements whenever they are relevant.`
      : "No birth chart has been generated yet. If the question genuinely needs one, ask for date, exact time and place of birth in one short sentence before interpreting.";

    const transcript = data.messages
      .map((m) => `${m.role === "user" ? "Visitor" : "Astrologer"}: ${m.content}`)
      .join("\n");

    const visitor = data.name
      ? `The visitor's name is ${data.name}. Greet them by name once, then continue.`
      : "";
    const language =
      data.lang === "hi"
        ? "Answer entirely in Hindi using Devanagari script, keeping Sanskrit terms (dasha, rashi, lagna, nakshatra) as they are."
        : "Write in plain English (you may use common Hindi terms like dasha, rashi, lagna).";

    const prompt = `You are a senior Vedic astrologer at Vastugrah, Faridabad, specialising only in ${focus}.

${chart}
${visitor}

Rules:
- Answer the visitor's latest message precisely in 2 to 4 sentences. No filler, no disclaimers, no lists of questions.
- Base every statement on classical Jyotish (grahas, bhavas, rashis, nakshatras, dashas, transits). Name the planet or house you are using.
- If the chart is missing a needed detail, ask for exactly that one detail.
- Never predict death, or diagnose illness; for health, speak about constitution, routine and care.
- Write warmly but factually. ${language}
- Only if the conversation is already 2 or more exchanges deep, close with one short sentence offering a detailed reading by a human astrologer.

Conversation so far:
${transcript}

Reply as the astrologer, plain text only.`;

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey, // header, so the key never appears in URLs or logs
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        console.error("Gemini error:", response.status, err);
        return { reply: FALLBACK_REPLY };
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
      return { reply: text || FALLBACK_REPLY };
    } catch (err) {
      console.error("Gemini request failed:", err);
      return { reply: FALLBACK_REPLY };
    }
  });

/* ------------------------------------------------------------------ */
/* FreeAstrologyAPI proxy                                              */
/* ------------------------------------------------------------------ */

const AstroApiInput = z.object({
  // Letters, digits, "/", "_" and "-" only, so callers can't use ".." or "?" tricks.
  endpoint: z
    .string()
    .min(1)
    .max(100)
    .regex(/^\/?[a-zA-Z0-9/_-]+$/, "Invalid endpoint")
    .refine((v) => !v.includes(".."), "Invalid endpoint"),
  payload: z.record(z.any()).optional(),
});

export const callAstroApi = createServerFn({ method: "POST" })
  .validator(AstroApiInput)
  .handler(async ({ data }) => {
    const apiKey = process.env.FREE_ASTRO_API_KEY;
    if (!apiKey) {
      console.error("FREE_ASTRO_API_KEY is not set");
      return { error: "Astro API is not configured" };
    }

    const endpoint = data.endpoint.startsWith("/") ? data.endpoint.slice(1) : data.endpoint;

    try {
      const res = await fetch(`https://json.freeastrologyapi.com/v1/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(data.payload || {}),
      });
      return await res.json();
    } catch (err) {
      console.error("Free Astro API error:", err);
      return { error: "Astro API request failed" };
    }
  });