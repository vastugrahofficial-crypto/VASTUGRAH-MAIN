import React, { useState } from "react";
import { Heart, Wallet, Briefcase, HeartPulse, ChevronRight, ChevronUp } from "lucide-react";
import { useLang } from "@/lib/i18n";

const LOOK = {
  love: { Icon: Heart, color: "#E2565A" },
  finance: { Icon: Wallet, color: "#0E9B72" },
  career: { Icon: Briefcase, color: "#D48842" },
  health: { Icon: HeartPulse, color: "#2B6CB0" },
};

export default function AreaCard({ sign, area }) {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const { Icon, color } = LOOK[area.key] ?? LOOK.love;

  return (
    <div className="rounded-3xl border border-border bg-card p-4 transition sm:p-5" style={{ borderColor: `${color}45` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${color}1f`, color }}
          >
            <Icon size={19} strokeWidth={1.8} />
          </span>
          <div>
            <h3 className="font-heading text-lg leading-tight sm:text-xl">
              {sign} {area.label}
            </h3>
            <p className="text-xs text-muted-foreground">{t("common.todayReading")}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={`${area.label} ${sign}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary transition hover:bg-secondary/70"
          style={{ color }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t("common.strength")}</span>
        <span className="font-medium" style={{ color }}>{area.score}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: `${color}26` }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${area.score}%`, backgroundColor: color }} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        {open ? area.more : area.text}
      </p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium"
        style={{ color }}
      >
        {open ? t("common.readLess") : t("common.readMore")}
        {open && <ChevronUp size={12} />}
      </button>
    </div>
  );
}