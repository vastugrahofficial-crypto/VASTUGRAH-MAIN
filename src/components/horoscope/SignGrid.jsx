import React from "react";
import ZodiacGlyph from "@/components/site/ZodiacGlyph";
import { SIGN_META } from "@/components/horoscope/horoscopeData";
import { SIGN_HI } from "@/components/horoscope/horoscopeHindi";
import { useLang } from "@/lib/i18n";

export default function SignGrid({ active, onPick }) {
  const { lang } = useLang();

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {SIGN_META.map((m, i) => {
        const selected = i === active;
        return (
          <button
            key={m.sign}
            type="button"
            onClick={() => onPick(i)}
            aria-pressed={selected}
            className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 transition ${
              selected
                ? "border-primary bg-primary text-primary-foreground shadow-[0_16px_34px_-22px_hsl(var(--primary))]"
                : "border-border bg-card text-foreground hover:border-primary"
            }`}
          >
            <ZodiacGlyph index={i} size={26} strokeWidth={1.7} />
            <span className="text-xs font-medium leading-none sm:text-sm">{lang === "hi" ? SIGN_HI[i].name : m.sign}</span>
            <span className={`text-[0.58rem] leading-none ${selected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {lang === "hi" ? SIGN_HI[i].range : m.range}
            </span>
          </button>
        );
      })}
    </div>
  );
}