import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X, MessageCircle, Phone, Mail } from "lucide-react";
import BrandLogo from "@/components/site/BrandLogo";
import ThemeToggle from "@/components/site/ThemeToggle";
import LangToggle from "@/components/site/LangToggle";
import { ADDRESS, EMAIL, PHONE_TEL, waLink } from "@/lib/site";
import { buildAiNav, buildNav } from "@/lib/navMenu";
import { useLang } from "@/lib/i18n";

export default function NavDrawer({ open, onClose }) {
  const { t, lang } = useLang();
  const [mounted, setMounted] = useState(false);
  const [sub, setSub] = useState(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setSub(null);
      return undefined;
    }
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const items = [...buildNav(t, lang), buildAiNav(t, lang)];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            type="button"
            aria-label={t("common.close")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full bg-foreground/40 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("common.menu")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto overscroll-contain rounded-l-[2rem] border-l border-border bg-card px-6 pb-8 pt-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Link to="/" onClick={onClose} className="flex items-center gap-3">
                <BrandLogo className="h-11 w-11" px={192} />
                <span className="font-heading text-xl tracking-[0.18em]">VASTUGRAH</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("common.close")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-primary hover:text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <nav aria-label="Site" className="mt-8 flex flex-col">
              {items.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.04, duration: 0.3 }}
                  className="border-b border-border/70"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={n.to}
                      onClick={onClose}
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "text-primary" }}
                      className="flex-1 py-4 font-heading text-2xl transition hover:text-primary"
                    >
                      {n.label}
                    </Link>
                    {n.children && (
                      <button
                        type="button"
                        aria-expanded={sub === n.to}
                        aria-label={`${n.label} ${t("menu.options")}`}
                        onClick={() => setSub((v) => (v === n.to ? null : n.to))}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-primary hover:text-primary"
                      >
                        <ChevronDown size={16} className={`transition ${sub === n.to ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {n.children && sub === n.to && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        {n.children.map((c) => (
                          <li key={c.key}>
                            {c.href ? (
                              <a
                                href={c.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={onClose}
                                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-primary"
                              >
                                {c.label}
                                <span aria-hidden="true">↗</span>
                              </a>
                            ) : (
                              <Link
                                to={c.to}
                                search={c.search}
                                onClick={onClose}
                                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-primary"
                              >
                                {c.label}
                                <span aria-hidden="true">→</span>
                              </Link>
                            )}
                          </li>
                        ))}
                        <li className="h-1" />
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </nav>

            <div className="mt-6 flex items-center justify-between gap-2 rounded-2xl border border-border bg-secondary/50 px-4 py-3">
              <span className="btn-caps text-muted-foreground">{t("common.language")}</span>
              <LangToggle />
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-secondary/50 px-4 py-3">
              <span className="btn-caps text-muted-foreground">{t("common.appearance")}</span>
              <ThemeToggle />
            </div>

            <a
              href={waLink("Namaste Vastugrah, I want to book a consultation.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="btn-caps mt-4 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-primary px-6 text-primary-foreground transition hover:opacity-90"
            >
              <MessageCircle size={16} /> {t("common.bookNow")}
            </a>

            <div className="mt-auto space-y-3 pt-8 text-sm text-muted-foreground">
              <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-3 transition hover:text-primary">
                <Phone size={15} /> {t("footer.call")}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 transition hover:text-primary">
                <Mail size={15} /> {EMAIL}
              </a>
              <p className="text-xs">{ADDRESS}</p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}