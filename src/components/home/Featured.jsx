import React from "react";
import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import SectionTitle from "@/components/site/SectionTitle";
import { FEATURED } from "@/lib/site";
import { useLang } from "@/lib/i18n";

export default function Featured() {
  const { t, lang } = useLang();

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      <SectionTitle eyebrow={t("pillars.eyebrow")} title={t("pillars.title")} sub={t("pillars.sub")} />
      <div className="grid gap-3 md:grid-cols-3 md:gap-5">
        {FEATURED.map((f, i) => {
          const title = lang === "hi" ? f.titleHi : f.title;
          return (
            <Reveal key={f.title} delay={i * 0.1}>
              <Link to="/services" className="harmonic group flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card transition duration-500 md:block">
                <div className="shrink-0 overflow-hidden">
                  <Image
                    src={f.img}
                    alt={title}
                    className="h-[92px] w-[92px] rounded-l-2xl transition duration-700 group-hover:scale-110 md:h-40 md:w-full md:rounded-l-none md:rounded-t-2xl"
                  />
                </div>
                <div className="p-2.5 pr-4 md:p-4">
                  <h3 className="text-lg leading-tight md:text-2xl">{title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:mt-2 md:line-clamp-none md:text-sm">{lang === "hi" ? f.descHi : f.desc}</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}