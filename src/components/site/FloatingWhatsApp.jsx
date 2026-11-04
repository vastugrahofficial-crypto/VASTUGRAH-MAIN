import React from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";
import { useLang } from "@/lib/i18n";

export default function FloatingWhatsApp() {
  const { t } = useLang();

  return (
    <a
      href={waLink("Namaste Vastugrah, I wish to align my space and destiny. Please guide me.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("float.chat")}
      className="fixed bottom-24 right-4 z-50 flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-5 text-white shadow-xl transition hover:scale-105 lg:bottom-5 lg:right-5"
    >
      <span className="pulse-ring absolute inset-0 rounded-full bg-[#25D366]" aria-hidden="true" />
      <MessageCircle className="relative" size={22} />
      <span className="relative hidden text-sm font-medium sm:inline">{t("float.chat")}</span>
    </a>
  );
}