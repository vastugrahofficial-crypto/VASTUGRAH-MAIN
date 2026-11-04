import React from "react";
import ZodiacGlyph from "@/components/site/ZodiacGlyph";

export default function LuckyGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-border/80 bg-secondary/40 px-3 py-2.5">
          <p className="text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
          {item.swatches ? (
            <div className="mt-2 flex items-center gap-1.5">
              {item.swatches.map((c) => (
                <span key={c} className="h-4 w-8 rounded-md ring-1 ring-black/5" style={{ backgroundColor: c }} />
              ))}
            </div>
          ) : (
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium leading-snug">
              {typeof item.glyph === "number" && <ZodiacGlyph index={item.glyph} size={16} strokeWidth={1.8} />}
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}