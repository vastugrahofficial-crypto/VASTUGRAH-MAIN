import React from "react";

const PLANET_COLORS = {
  Su: "text-amber-600 dark:text-amber-400",
  Mo: "text-indigo-600 dark:text-indigo-400",
  Ma: "text-rose-600 dark:text-rose-400",
  Me: "text-emerald-600 dark:text-emerald-400",
  Ju: "text-purple-600 dark:text-purple-400",
  Ve: "text-pink-600 dark:text-pink-400",
  Sa: "text-slate-700 dark:text-slate-300",
  Ra: "text-orange-700 dark:text-orange-400",
  Ke: "text-stone-600 dark:text-stone-400",
};

// Anchors relative to a 300x300 North Indian Kundli chart
const ANCHORS = [
  { x: 150, y: 75 },   // House 1 (top diamond)
  { x: 75, y: 35 },    // House 2 (top left)
  { x: 35, y: 75 },    // House 3 (left top)
  { x: 75, y: 150 },   // House 4 (left diamond)
  { x: 35, y: 225 },   // House 5 (left bottom)
  { x: 75, y: 265 },   // House 6 (bottom left)
  { x: 150, y: 225 },  // House 7 (bottom diamond)
  { x: 225, y: 265 },  // House 8 (bottom right)
  { x: 265, y: 225 },  // House 9 (right bottom)
  { x: 225, y: 150 },  // House 10 (right diamond)
  { x: 265, y: 75 },   // House 11 (right top)
  { x: 225, y: 35 },   // House 12 (top right)
];

export default function ChartDiagram({ chart }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-4 transition shadow-sm">
      <div className="mb-3">
        <h4 className="font-heading text-base font-semibold text-foreground">{chart.title}</h4>
        <p className="text-xs text-muted-foreground">{chart.subtitle}</p>
      </div>

      <div className="relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden rounded-xl border border-primary/30 bg-secondary/20">
        <svg viewBox="0 0 300 300" className="h-full w-full stroke-primary/50" fill="none" strokeWidth="1.2">
          {/* Outer square */}
          <rect x="0" y="0" width="300" height="300" />
          {/* Inner margin */}
          <rect x="6" y="6" width="288" height="288" strokeWidth="0.5" className="stroke-primary/20" />
          {/* Diagonals */}
          <line x1="0" y1="0" x2="300" y2="300" />
          <line x1="0" y1="300" x2="300" y2="0" />
          {/* Center Diamond */}
          <polygon points="150,0 300,150 150,300 0,150" strokeWidth="1.2" />
        </svg>

        {/* House Content Overlays */}
        {chart.houses.map((house, i) => {
          const anchor = ANCHORS[i];
          const hasPlanets = house.planets && house.planets.length > 0;

          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none"
              style={{ left: `${(anchor.x / 300) * 100}%`, top: `${(anchor.y / 300) * 100}%` }}
            >
              {/* Sign Number */}
              <span className="text-[10px] font-bold text-primary/80 leading-none">
                {house.sign + 1}
              </span>

              {/* Planets */}
              {hasPlanets && (
                <div className="mt-0.5 flex flex-wrap justify-center gap-x-1 gap-y-0.5 max-w-[65px]">
                  {house.planets.map((p, idx) => (
                    <span
                      key={idx}
                      className={`text-[9px] font-semibold tracking-tighter ${
                        PLANET_COLORS[p.abbr] || "text-foreground"
                      }`}
                    >
                      {p.abbr}
                      {p.deg !== undefined && (
                        <span className="text-[8px] opacity-75">{p.deg}°</span>
                      )}
                      {p.retro && <span className="text-[7px] text-destructive">r</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

