import React from "react";

// Hand-drawn zodiac marks on a 48×48 grid — vector lines, never emoji.
export const ZODIAC_PATHS = [
  ["M24 41V19", "M24 19c0-7-2.5-11-7.5-11S9 11.5 9 16s2.5 6.5 5.5 6.5", "M24 19c0-7 2.5-11 7.5-11S39 11.5 39 16s-2.5 6.5-5.5 6.5"],
  ["M12 9.5c1.5 8 5.5 12 12 12s10.5-4 12-12"],
  ["M15 12h18", "M15 36h18", "M18.5 12v24", "M29.5 12v24"],
  ["M13 17.5a6 6 0 1 1 6 6c0 6-2 9-6 12", "M35 30.5a6 6 0 1 1-6-6c0-6 2-9 6-12"],
  ["M17 12.5a5 5 0 1 0 5 6.5c0 9-7 10-7 16.5a6 6 0 0 0 11.5 2.5c3-6 7-8 11-6"],
  ["M12 12v24", "M12 17c0-3 4-4 5 0v19", "M17 19c0-3 4-4 5 0v17", "M22 19c0-3 4-4 5 0v13c0 3 1.5 4.5 3.5 4.5S34 35 34 32"],
  ["M9 34h30", "M15 34c0-8 3.5-12 9-12s9 4 9 12"],
  ["M11 12v24", "M11 19c0-4 5-5 6 0v18", "M17 19c0-4 5-5 6 0v18", "M23 37c0 3 6 4 11 1l3-3", "M31 29l6-4 1 7"],
  ["M13 35L33 15", "M25 15h8v8", "M19 29l-3 3", "M22 32l-3 3"],
  ["M11 12c0 16 5 24 9 24s6-10 6-16c0-4 4-6 6-2s2 8 5.5 8 4-2 4-5"],
  ["M10 19l4-7 6 14 6-14 6 14 4-7", "M10 31l4-7 6 14 6-14 6 14 4-7"],
  ["M17 11c-6 7-6 19 0 26", "M31 11c6 7 6 19 0 26", "M15 24h18"],
];

export default function ZodiacGlyph({ index = 0, size = 28, className = "", strokeWidth = 1.6 }) {
  const paths = ZODIAC_PATHS[index] ?? ZODIAC_PATHS[0];
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {index === 1 && <circle cx="24" cy="30" r="8" />}
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}