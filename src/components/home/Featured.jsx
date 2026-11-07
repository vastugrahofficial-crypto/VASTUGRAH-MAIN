import React from "react";
import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import SectionTitle from "@/components/site/SectionTitle";
import { FEATURED } from "@/lib/site";
import { useLang } from "@/lib/i18n";

// Which part of each picture stays visible when it is cropped to the card
// (same order as FEATURED: Vastu Audit, Gemology, Astrology).
// "50% 50%" = centre, "50% 10%" = favour the top, "30% 50%" = favour the left.
const FOCUS = ["50% 8%", "50% 65%", "30% 50%"];

export default function Featured() {
  const { t, lang } = useLang();

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      <SectionTitle eyebrow={t("pillars.eyebrow")} title={t("pillars.title")} sub={t("pillars.sub")} />
      {/* [&>*]:h-full + h-full on the link make all three cards the same height */}
      <div className="grid gap-3 md:grid-cols-3 md:gap-5 [&>*]:h-full">
        {FEATURED.map((f, i) => {
          const title = lang === "hi" ? f.titleHi : f.title;
          return (
            <Reveal key={f.title} delay={i * 0.1}>
              <Link
                to="/services"
                className="harmonic group flex h-full items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card transition duration-500 md:flex-col md:items-stretch md:gap-0"
              >
                <div className="relative shrink-0 overflow-hidden">
                  {/* object-cover keeps the picture's proportions (no stretching) and crops the overflow */}
                  <Image
                    src={f.img}
                    alt={title}
                    style={{ objectPosition: FOCUS[i] || "50% 50%" }}
                    className="h-[92px] w-[92px] rounded-l-2xl object-cover transition duration-700 group-hover:scale-110 md:h-56 md:w-full md:rounded-l-none md:rounded-t-2xl"
                  />
                  {/* Picture fades into the card colour at the bottom (theme-aware, no hard edge) */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-28 bg-gradient-to-t from-card via-card/60 to-transparent md:block"
                  />
                </div>
                {/* On larger screens the text sits over the faded part of the picture */}
                <div className="p-2.5 pr-4 md:relative md:z-10 md:-mt-12 md:flex-1 md:p-4 md:pt-0">
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