import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import SectionTitle from "@/components/site/SectionTitle";
import Reveal from "@/components/site/Reveal";
import ICONS from "@/components/ai/specialistIcons";
import { SPECIALISTS, specialistName } from "@/lib/aiAstrologers";
import { useLang } from "@/lib/i18n";

export default function AiPortal() {
  const { t, lang } = useLang();

  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
      <SectionTitle eyebrow={t("ai.eyebrow")} title={t("ai.title")} sub={t("ai.sub")} />
      <Reveal>
        <div className="soft-panel flex flex-col items-center gap-6 rounded-3xl border border-border p-6 text-center sm:p-8 lg:flex-row lg:justify-between lg:text-left">
          <div className="lg:max-w-xl">
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              {SPECIALISTS.slice(0, 6).map((s) => {
                const Icon = ICONS[s.icon];
                return (
                  <Link
                    key={s.id}
                    to="/ai-astrologer"
                    search={{ specialist: s.id }}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs transition hover:border-primary hover:text-primary"
                  >
                    {Icon && <Icon size={12} style={{ color: s.accent }} strokeWidth={1.8} />}
                    {specialistName(s, lang)}
                  </Link>
                );
              })}
              <span className="flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                {t("ai.more")}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t("ai.blurb")}</p>
          </div>
          <Link
            to="/ai-astrologer"
            className="btn-caps inline-flex min-h-[50px] w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-primary-foreground transition hover:opacity-90 sm:w-auto"
          >
            <Sparkles size={16} /> {t("ai.open")} <ArrowRight size={15} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}