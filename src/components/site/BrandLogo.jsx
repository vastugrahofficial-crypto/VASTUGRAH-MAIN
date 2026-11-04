import React from "react";
import { LOGO } from "@/lib/site";

export default function BrandLogo({ className = "h-12 w-12", px = 192, ring = true }) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${ring ? "ring-1 ring-primary/40" : ""} ${className}`}
    >
      <img
        src={LOGO}
        alt="Vastugrah emblem"
        width={px}
        height={px}
        decoding="async"
        className="h-full w-full object-cover"
      />
    </span>
  );
}
