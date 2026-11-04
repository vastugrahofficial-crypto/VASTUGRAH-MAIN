import React from "react";
import { Image } from "@/components/ui/image";

export const initialsOf = (name) => {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "You";
  return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase();
};

/**
 * The visitor's profile mark: their photo when the account has one, otherwise
 * the gold initials circle from the brand reference.
 */
export default function Avatar({ name, src, className = "h-8 w-8 text-[11px]" }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name || "Profile"}
        fittingType="fill"
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}