import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import BrandLogo from "@/components/site/BrandLogo";
import { FEATURED } from "@/lib/site";

const SLIDES = [
  { logo: true, to: "/", alt: "Vastugrah emblem with compass, rashis and diya", title: "Vastugrah", caption: "Jyotish & Vastu, rooted in tradition" },
  ...FEATURED.map((f, i) => ({
    src: f.img,
    to: i === 0 ? "/services" : i === 1 ? "/services" : "/kundli",
    alt: f.title,
    title: f.title,
    caption: f.desc,
  })),
];

export default function BrandSlideshow() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const total = SLIDES.length;

  useEffect(() => {
    if (reduce) return undefined;
    const timer = setInterval(() => setActive((v) => (v + 1) % total), 4200);
    return () => clearInterval(timer);
  }, [reduce, total]);

  const go = (step) => setActive((v) => (v + step + total) % total);

  return (
    <div>
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[176px] px-4 pb-4 sm:max-w-[290px] sm:px-6 lg:max-w-[360px] lg:px-7">
        {SLIDES.map((slide, i) => {
          const pos = (i - active + total) % total;
          const target =
            pos === 0
              ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
              : pos === 1
                ? { x: 10, y: -10, rotate: 2.4, scale: 0.96, opacity: 0.8 }
                : pos === 2
                  ? { x: 18, y: -18, rotate: 4.8, scale: 0.92, opacity: 0.45 }
                  : { x: 25, y: -25, rotate: 7, scale: 0.88, opacity: 0 };

          return (
            <motion.button
              type="button"
              key={slide.alt}
              style={{ zIndex: total - pos }}
              initial={false}
              animate={reduce ? { opacity: pos === 0 ? 1 : 0, x: 0, y: 0, rotate: 0, scale: 1 } : target}
              transition={{ type: "spring", stiffness: 95, damping: 17 }}
              aria-hidden={pos !== 0}
              tabIndex={pos === 0 ? 0 : -1}
              aria-label={pos === 0 ? `Open ${slide.title}` : `Bring ${slide.title} forward`}
              onClick={() => (pos === 0 ? navigate({ to: slide.to }) : setActive(i))}
              className="absolute inset-0 overflow-hidden rounded-[2rem] border border-primary/40 bg-card text-left shadow-[0_28px_60px_-32px_hsl(var(--primary)/0.8)]"
            >
              {slide.logo ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary/70 via-card to-secondary/40">
                  <BrandLogo className="h-[78%] w-[78%]" px={480} ring={false} />
                </div>
              ) : (
                <Image src={slide.src} alt={slide.alt} className="h-full w-full" />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3.5 sm:p-4 lg:p-5">
                <span className="block font-heading text-base leading-tight text-white sm:text-xl lg:text-2xl">{slide.title}</span>
                <span className="hidden text-xs text-white/80 sm:block sm:text-sm">{slide.caption}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-primary hover:text-primary"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.alt}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${slide.title}`}
              aria-pressed={i === active}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/60"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-primary hover:text-primary"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}