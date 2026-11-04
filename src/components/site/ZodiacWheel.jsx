import React from "react";
import { ZODIAC_PATHS } from "@/components/site/ZodiacGlyph";

const OUTER = 196;
const INNER_RING = 156;
const CORE_RING = 130;

const point = (radius, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [Math.cos(rad) * radius, Math.sin(rad) * radius];
};

const star = (count, skip, radius) =>
  Array.from({ length: count }, (_, i) => point(radius, (360 / count) * ((i * skip) % count)))
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

/**
 * The reference wheel: three bold concentric rings, a multi-pointed star inside
 * and the twelve rashi marks drawn as vector paths, each sitting in the middle
 * of its own band — never on a dividing spoke.
 */
export default function ZodiacWheel({ className = "" }) {
  return (
    <svg
      viewBox="-210 -210 420 420"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {[OUTER, INNER_RING, CORE_RING].map((r) => (
        <circle key={r} r={r} strokeWidth="2.6" />
      ))}

      {ZODIAC_PATHS.map((_, i) => {
        const [x1, y1] = point(INNER_RING, i * 30);
        const [x2, y2] = point(OUTER, i * 30);
        return <line key={`div-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.4" />;
      })}

      <polygon points={star(12, 5, CORE_RING * 0.88)} strokeWidth="2.1" />
      <polygon points={star(12, 5, CORE_RING * 0.52)} strokeWidth="1.3" />
      {ZODIAC_PATHS.map((_, i) => {
        const [x, y] = point(CORE_RING * 0.88, i * 30);
        return <line key={`ray-${i}`} x1="0" y1="0" x2={x} y2={y} strokeWidth="0.7" />;
      })}
      <circle r="5" strokeWidth="2" />

      {ZODIAC_PATHS.map((paths, i) => {
        const [x, y] = point((OUTER + INNER_RING) / 2, i * 30 + 15);
        return (
          <g
            key={`glyph-${i}`}
            transform={`translate(${x} ${y}) rotate(${i * 30 + 15}) scale(0.6) translate(-24 -24)`}
            strokeWidth="2.4"
          >
            {paths.map((d, k) => (
              <path key={k} d={d} />
            ))}
            {i === 1 && <circle cx="24" cy="30" r="8" />}
          </g>
        );
      })}
    </svg>
  );
}