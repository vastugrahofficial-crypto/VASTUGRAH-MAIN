import React from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";

export default function WaButton({ text, children, className = "", variant = "solid" }) {
  const styles =
    variant === "solid"
      ? "rounded-full bg-primary text-primary-foreground hover:opacity-90"
      : "rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground";
  return (
    <a
      href={waLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-caps inline-flex min-h-[44px] items-center justify-center gap-2 px-6 py-3 transition ${styles} ${className}`}
    >
      <MessageCircle size={16} />
      {children}
    </a>
  );
}