import React from "react";
import { Link } from "@tanstack/react-router";
import { House, Bot, Sparkles, ScrollText, Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function MobileNav() {
  const { t } = useLang();
  const items = [
    { to: "/", label: t("nav.home"), Icon: House },
    { to: "/ai-astrologer", label: t("nav.ai"), Icon: Bot },
    { to: "/kundli", label: t("nav.kundli"), Icon: ScrollText },
    { to: "/horoscope", label: t("nav.rashifal"), Icon: Sparkles },
    { to: "/contact", label: t("nav.contact"), Icon: Phone },
  ];

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="grid grid-cols-5">
        {items.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-center text-[10px] leading-tight text-muted-foreground transition hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            <Icon size={20} strokeWidth={1.6} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}