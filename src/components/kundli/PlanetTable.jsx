import React from "react";
import { useLang } from "@/lib/i18n";

const HEAD = {
  en: ["Planet", "Sign", "Degree", "Nakshatra", "Pada", "House", "Motion"],
  hi: ["ग्रह", "राशि", "अंश", "नक्षत्र", "पद", "भाव", "गति"],
};

export default function PlanetTable({ planets }) {
  const { lang } = useLang();
  const head = HEAD[lang] ?? HEAD.en;

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="font-heading text-xl">{lang === "hi" ? "ग्रह स्थिति" : "Planetary Positions"}</h3>
        <span className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">{lang === "hi" ? "निरयण · लाहिरी" : "Sidereal · Lahiri"}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-secondary/60 text-left text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
              {head.map((h) => (
                <th key={h} className="px-3 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planets.map((p) => (
              <tr key={p.name} className="border-t border-border/70">
                <td className="px-3 py-2">
                  <span className="font-medium">{p.name}</span>
                  <span className="ml-1 text-xs text-muted-foreground">{p.sanskrit}</span>
                </td>
                <td className="px-3 py-2">{p.signName}</td>
                <td className="px-3 py-2 tabular-nums">{p.degreeText}</td>
                <td className="px-3 py-2">{p.nakshatra}</td>
                <td className="px-3 py-2 tabular-nums">{p.pada}</td>
                <td className="px-3 py-2 tabular-nums">{p.house}</td>
                <td className="px-3 py-2">
                  {p.retro
                    ? <span className="text-primary">{lang === "hi" ? "वक्री" : "Retrograde"}</span>
                    : lang === "hi" ? "मार्गी" : "Direct"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}