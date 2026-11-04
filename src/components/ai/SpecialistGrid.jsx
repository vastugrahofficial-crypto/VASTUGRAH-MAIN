import React from "react";
import ICONS from "@/components/ai/specialistIcons";
import { SPECIALISTS, specialistName } from "@/lib/aiAstrologers";
import { useLang } from "@/lib/i18n";

export default function SpecialistGrid({ activeId, onPick }) {
  const { lang } = useLang();
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {SPECIALISTS.map((s) => {
        const Icon = ICONS[s.icon] ?? BriefcaseFallback;
        const active = s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id)}
            aria-pressed={active}
            className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
              active
                ? "border-primary bg-primary/10 text-foreground shadow-[0_10px_30px_-18px_hsl(var(--primary))]"
                : "border-border bg-card text-foreground/80 hover:border-primary/70"
            }`}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${s.accent}1f`, color: s.accent }}
            >
              <Icon size={16} strokeWidth={1.7} />
            </span>
            <span className="truncate">{specialistName(s, lang)}</span>
          </button>
        );
      })}
    </div>
  );
}

function BriefcaseFallback() {
  return null;
}