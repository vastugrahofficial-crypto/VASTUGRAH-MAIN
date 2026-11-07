import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SectionTitle from "@/components/site/SectionTitle";
import AstrologerCard from "./AstrologerCard";
import AstrologerArc from "./AstrologerArc";
import { ASTROLOGERS } from "@/lib/astrologers";
import { useLang } from "@/lib/i18n";

const TICK_MS = 4500; // how often the card moves to the next astrologer
const IDLE_MS = 8000; // after a tap, drag or keypress, wait this long before auto-swiping again

export default function Astrologers() {
  const { lang } = useLang();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const hovering = useRef(false);
  const visible = useRef(true);
  const lastTouch = useRef(0);
  const total = ASTROLOGERS.length;

  const markInteraction = useCallback(() => {
    lastTouch.current = Date.now();
  }, []);

  // Only auto-swipe while the section is actually on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-swipe: pauses while the visitor hovers (mouse), interacts, or the tab is hidden;
  // stays off for visitors who prefer reduced motion.
  useEffect(() => {
    if (reduce || total < 2) return undefined;
    const timer = setInterval(() => {
      if (document.hidden || !visible.current || hovering.current) return;
      if (Date.now() - lastTouch.current < IDLE_MS) return;
      setActive((v) => (v + 1) % total);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [reduce, total]);

  const handleChange = (index) => {
    markInteraction();
    setActive(index);
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle
          eyebrow={lang === "hi" ? "हमारे आचार्य" : "Our Astrologers"}
          title={lang === "hi" ? "अनुभवी वैदिक ज्योतिषी" : "Senior Vedic Astrologers"}
          sub={
            lang === "hi"
              ? "प्रत्येक आचार्य का अपना विशिष्ट क्षेत्र और दशकों का प्रामाणिक अनुभव है।"
              : "Decades of classical Jyotish, Vastu and gemstone guidance from seasoned Acharyas."
          }
        />
        <div
          className="mt-10 flex flex-col items-center"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") hovering.current = true;
          }}
          onPointerLeave={() => {
            hovering.current = false;
          }}
          onPointerDown={markInteraction}
          onFocusCapture={markInteraction}
        >
          <AstrologerCard a={ASTROLOGERS[active]} lang={lang} consult={lang === "hi" ? "परामर्श लें" : "Consult Now"} />
          <div className="mt-8 w-full max-w-2xl">
            <AstrologerArc active={active} onChange={handleChange} onInteract={markInteraction} />
          </div>
        </div>
      </div>
    </section>
  );
}