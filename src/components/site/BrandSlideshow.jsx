import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Put the image files in  public/images/  and list them here.
//  - src:   path starting with /images/
//  - focus: which part of the picture stays visible when it is cropped to the portrait card
//           ("50% 50%" = centre, "20% 50%" = favour the left side, "50% 20%" = favour the top)
//  - to:    page that opens when the card is clicked
const SLIDES = [
  {
    src: "/images/astrology.jpg",
    focus: "25% 50%",
    to: "/kundli",
    title: "Astrology",
    caption: "Kundli reading with real clarity.",
  },
  {
    src: "/images/astrologer.jpg",
    focus: "50% 35%",
    to: "/about",
    title: "Our Astrologer",
    caption: "Guidance rooted in classical Jyotish.",
  },
  {
    src: "/images/vastu-audit.jpg",
    focus: "45% 50%",
    to: "/services",
    title: "Vastu Audit",
    caption: "Compass-accurate analysis of your space.",
  },
  {
    src: "/images/gemology.jpg",
    focus: "50% 50%",
    to: "/services",
    title: "Gemology",
    caption: "Stones chosen by your planetary needs.",
  },
  {
    src: "/images/vastu-purusha.jpg",
    focus: "50% 45%",
    to: "/services",
    title: "Vastu Purusha",
    caption: "The sacred grid behind every Vastu plan.",
  },
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
              key={slide.src}
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
              {/* object-cover keeps the picture's proportions (no squeezing or stretching) and crops the overflow */}
              <img
                src={slide.src}
                alt={slide.title}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
                className="block h-full w-full select-none object-cover"
                style={{ objectPosition: slide.focus }}
              />
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
              key={slide.src}
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