import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import Avatar from "@/components/ai/Avatar";
import { useLang } from "@/lib/i18n";

export default function AiChat({ specialist, messages, busy, onSend, user }) {
  const { t } = useLang();
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length, busy]);

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
          {messages.map((m, i) => (
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
              <div
                className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground/90"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <Avatar name={user?.name} src={user?.image} className="mt-0.5 h-7 w-7 text-[10px]" />
              )}
            </motion.div>
          ))}
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