import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import Avatar from "@/components/ai/Avatar";
import { useLang } from "@/lib/i18n";

// WhatsApp number of the human astrologer (country code + number, digits only)
const WHATSAPP_NUMBER = "919311001071";

const HAS_DEVANAGARI = /[\u0900-\u097F]/;

// Error / fallback messages from the server should not get the button.
const isErrorReply = (text = "") =>
  text.startsWith("Sorry, the astrologer couldn't") || text.startsWith("क्षमा करें, ज्योतिषी");

export default function AiChat({ specialist, messages, busy, onSend, user }) {
  const { t } = useLang();
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length, busy]);

  // Show the WhatsApp button under the latest real AI answer
  // (not the opening greeting at index 0, and not error messages).
  let ctaIndex = -1;
  for (let i = messages.length - 1; i > 0; i--) {
    if (messages[i].role === "assistant" && !isErrorReply(messages[i].content)) {
      ctaIndex = i;
      break;
    }
  }

  const submit = (event) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || busy) return;
    setText("");
    onSend(value);
  };

  return (
    <div className="flex flex-col">
      <div className="max-h-[56vh] min-h-[260px] space-y-4 overflow-y-auto px-4 py-4 md:max-h-[520px]">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => {
            const showCta = i === ctaIndex && !busy;
            const isHindi = HAS_DEVANAGARI.test(m.content || "");
            const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Namaste Vastugrah, my ${specialist.name} AI astrologer suggested I speak to a human astrologer.`
            )}`;
            return (
              <motion.div
                key={`${i}-${m.role}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary">
                    <Sparkles size={13} />
                  </span>
                )}

                <div className={`flex max-w-[82%] flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-foreground/90"
                    }`}
                  >
                    {m.content}
                  </div>

                  {showCta && (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                      <MessageCircle size={15} />
                      {isHindi
                        ? "हमारे ज्योतिषी से व्हाट्सऐप पर बात करें"
                        : "Chat with our astrologer on WhatsApp"}
                    </a>
                  )}
                </div>

                {m.role === "user" && (
                  <Avatar name={user?.name} src={user?.image} className="mt-0.5 h-7 w-7 text-[10px]" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {busy && (
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary">
              <Sparkles size={13} className="animate-pulse" />
            </span>
            <div className="rounded-2xl border border-border bg-card px-3.5 py-2.5 text-sm text-muted-foreground">
              {specialist.name} {t("ai.thinking")}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex items-end gap-2 border-t border-border p-3">
        <label className="sr-only" htmlFor="ai-question">{t("ai.inputLabel")}</label>
        <input
          id="ai-question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={600}
          placeholder={`${t("ai.ask")} ${specialist.name.toLowerCase()}…`}
          className="min-h-[46px] w-full rounded-full border border-border bg-card px-4 text-sm outline-none transition focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy || !text.trim()}
          aria-label="Send question"
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}