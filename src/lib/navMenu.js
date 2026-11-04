import { EMAIL, NAV, SERVICES, waLink } from "@/lib/site";
import { SPECIALISTS } from "@/lib/aiAstrologers";

export const NAV_KEYS = {
  "/": "nav.home",
  "/services": "nav.services",
  "/horoscope": "nav.horoscope",
  "/kundli": "nav.kundli",
  "/about": "nav.about",
  "/contact": "nav.contact",
};

/** Every top-level menu entry with its localized sub-options — shared by the desktop hover menu and the mobile drawer. */
export function buildNav(t, lang) {
  const hi = lang === "hi";
  const children = {
    "/services": SERVICES.map((s) => ({
      key: `svc-${s.title}`,
      label: hi ? s.titleHi : s.title,
      note: hi ? s.groupHi : s.group,
      href: waLink(`Namaste Vastugrah, I want to know about ${s.title}.`),
    })),
    "/kundli": [
      { key: "k-free", label: t("nav.kundli"), to: "/kundli" },
      { key: "k-ai", label: t("nav.ai"), to: "/ai-astrologer" },
      { key: "k-horo", label: t("nav.horoscope"), to: "/horoscope" },
    ],
    "/contact": [
      { key: "c-wa", label: "WhatsApp", href: waLink("Namaste Vastugrah, I want to book a consultation.") },
      { key: "c-mail", label: EMAIL, href: `mailto:${EMAIL}` },
    ],
  };

  return NAV.map((n) => ({
    ...n,
    label: t(NAV_KEYS[n.to] ?? n.label),
    children: children[n.to],
  }));
}

export function buildAiNav(t, lang) {
  return {
    to: "/ai-astrologer",
    label: t("nav.ai"),
    children: SPECIALISTS.map((s) => ({
      key: s.id,
      label: lang === "hi" ? `${s.nameHi} ज्योतिषी` : `${s.name} astrologer`,
      to: "/ai-astrologer",
      search: { specialist: s.id },
    })),
  };
}