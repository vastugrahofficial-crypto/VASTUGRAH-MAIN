import React from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { ADDRESS, BRAND, EMAIL, NAV, PHONE_TEL, SOCIALS, waLink } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import LangToggle from "@/components/site/LangToggle";
import ThemeToggle from "@/components/site/ThemeToggle";

const social = [
  { href: SOCIALS.instagram, label: "Instagram", Icon: Instagram },
  { href: SOCIALS.facebook, label: "Facebook", Icon: Facebook },
  { href: SOCIALS.youtube, label: "YouTube", Icon: Youtube },
];

const NAV_KEYS = {
  "/": "nav.home",
  "/services": "nav.services",
  "/horoscope": "nav.horoscope",
  "/kundli": "nav.kundli",
  "/about": "nav.about",
  "/contact": "nav.contact",
};

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-border bg-card/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm text-muted-foreground">{t("footer.about")}</p>
        </div>
        <div>
          <h3 className="mb-4 text-xl">{t("footer.quick")}</h3>
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="inline-block py-1.5 text-muted-foreground transition hover:text-primary">{t(NAV_KEYS[n.to] ?? n.label)}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-xl">{t("footer.follow")}</h3>
          <div className="flex gap-3">
            {social.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition hover:bg-primary hover:text-primary-foreground">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xl">{t("footer.contact")}</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3"><Mail size={20} className="mt-1 shrink-0 text-primary" /><a href={`mailto:${EMAIL}`} className="break-all hover:text-primary">{EMAIL}</a></li>
            <li className="flex gap-3"><Phone size={20} className="mt-1 shrink-0 text-primary" /><span><a href={`tel:${PHONE_TEL}`} className="hover:text-primary">{t("footer.call")}</a> · <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-primary">WhatsApp</a></span></li>
            <li className="flex gap-3"><MapPin size={20} className="mt-1 shrink-0 text-primary" />{ADDRESS}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <div>
            <p className="btn-caps text-primary">{t("settings.title")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("settings.sub")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
              <span className="text-xs text-muted-foreground">{t("common.language")}</span>
              <LangToggle />
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
              <span className="text-xs text-muted-foreground">{t("common.appearance")}</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} {BRAND}. {t("footer.rights")}</div>
    </footer>
  );
}