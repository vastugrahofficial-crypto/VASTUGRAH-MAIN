import React from "react";
import { Quote } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionTitle from "@/components/site/SectionTitle";
import { TESTIMONIALS } from "@/lib/site";
import { useLang } from "@/lib/i18n";

export default function Testimonials() {
  const { t, lang } = useLang();

  return (
    <section className="border-y border-border bg-card/70 py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle eyebrow={t("testi.eyebrow")} title={t("testi.title")} />
        <div className="grid gap-3 md:grid-cols-3">
          {TESTIMONIALS.map((tst, i) => (
            <Reveal key={tst.name} delay={i * 0.1}>
              <figure className="h-full rounded-2xl border border-border bg-background p-4">
                <Quote className="mb-2 text-primary" size={18} strokeWidth={1.3} />
                <blockquote className="text-sm leading-relaxed text-muted-foreground">{lang === "hi" ? tst.textHi : tst.text}</blockquote>
                <figcaption className="mt-3 text-sm font-medium">
                  {tst.name} <span className="text-xs text-muted-foreground">· {tst.city}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}