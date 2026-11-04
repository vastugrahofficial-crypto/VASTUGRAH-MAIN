import React from "react";
import { Languages } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function LangToggle({ className = "" }) {
  const { lang, setLang, t } = useLang();
  const next = lang === "hi" ? "en" : "hi";

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={`${t("common.language")}: ${next === "hi" ? "हिन्दी" : "English"}`}
      title={t("common.language")}
      className={`flex h-11 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-foreground/80 transition hover:border-primary hover:text-primary ${className}`}
    >
      <Languages size={15} />
      {lang === "hi" ? "हिं" : "EN"}
    </button>
  );
}