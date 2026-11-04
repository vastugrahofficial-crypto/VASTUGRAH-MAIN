import React from "react";
import { useLang } from "@/lib/i18n";

export default function DashaTable({ dasha }) {
  const { lang } = useLang();
  const hi = lang === "hi";

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-heading text-xl">{hi ? "विंशोत्तरी दशा" : "Vimshottari Dasha"}</h3>
        <span className="rounded-full bg-primary/15 px-3 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-primary">
          {hi ? "अब" : "Now"}: {dasha.current}
        </span>
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        {hi ? "जन्म समय शेष" : "Balance at birth"}: {dasha.balance.lord} {dasha.balance.years} {hi ? "वर्ष" : "years"}
      </p>
      <ul className="divide-y divide-border/70">
        {dasha.periods.map((p) => (
          <li key={p.lord + p.from} className="flex items-center justify-between gap-3 py-2 text-sm">
            <span className={p.lord === dasha.current ? "font-semibold text-primary" : "font-medium"}>{p.lord}</span>
            <span className="text-muted-foreground tabular-nums">{p.from} — {p.to}</span>
            <span className="tabular-nums text-muted-foreground">{p.years} {hi ? "वर्ष" : "yrs"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}