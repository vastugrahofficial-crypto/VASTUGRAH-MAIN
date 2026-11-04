import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ASTROLOGERS } from "@/lib/astrologers";

const SIZE = 72;
const RISE = 22;

/**
 * Compact arc of portraits: one horizontal row you swipe freely. Each circle
 * sits on a cosine arc, so the one nearest the middle rises and grows while the
 * neighbours drop away — and that middle one feeds the panel above.
 */
export default function AstrologerArc({ active, onChange, onInteract }) {
  const scroller = useRef(null);
  const fromScroll = useRef(false);
  const reduce = useReducedMotion();
  const total = ASTROLOGERS.length;

  const centerOn = (index) => {
    const el = scroller.current;
    if (!el) return;
    const item = el.children[index];
    if (!item) return;
    const target = item.offsetLeft - (el.clientWidth - item.clientWidth) / 2;
    if (Math.abs(el.scrollLeft - target) < 10) return;
    el.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
  };

  useEffect(() => {
    // Only re-centre when the change came from a tap or the autoplay, never from
    // the visitor's own drag — that would fight their scrolling.
    if (fromScroll.current) {
      fromScroll.current = false;
      return;
    }
    centerOn(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce]);

  const handleScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const middle = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let closest = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const center = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(center - middle);
      if (distance < closest) {
        closest = distance;
        best = i;
      }
    });
    if (best !== active) {
      fromScroll.current = true;
      onChange(best);
    }
  };

  return (
    <div
      ref={scroller}
      onScroll={handleScroll}
      onPointerDown={() => onInteract?.()}
      onWheel={() => onInteract?.()}
      style={{ paddingLeft: `calc(50% - ${SIZE / 2}px)`, paddingRight: `calc(50% - ${SIZE / 2}px)` }}
      className="no-bar relative flex snap-x snap-mandatory items-end gap-2.5 overflow-x-auto pb-0.5 pt-6 sm:gap-4"
    >
      {ASTROLOGERS.map((a, i) => {
        const offset = total > 1 ? (i - active) / (total / 2) : 0;
        const clamped = Math.min(Math.abs(offset), 1);
        const y = -Math.round(Math.cos(clamped * (Math.PI / 2)) * RISE);
        const isActive = i === active;

        return (
          <button
            key={a.name}
            type="button"
            onClick={() => onChange(i)}
            aria-label={a.name}
            aria-pressed={isActive}
            className="relative shrink-0 snap-center"
            style={{ width: SIZE }}
          >
            <motion.div
              animate={{ y, scale: isActive ? 1 : 0.82, opacity: isActive ? 1 : 0.65 }}
              transition={{ type: "spring", stiffness: 190, damping: 24 }}
              className="flex flex-col items-center"
            >
              <div
                className="flex items-center justify-center rounded-xl font-heading text-white"
                style={{
                  width: SIZE,
                  height: SIZE,
                  fontSize: isActive ? 25 : 20,
                  background: `linear-gradient(155deg, ${a.accent}, ${a.accent}cc 58%, ${a.accent})`,
                  border: `2px solid ${isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                  boxShadow: isActive ? "0 0 0 4px hsl(var(--primary) / 0.14), 0 16px 28px -20px hsl(var(--primary))" : "none",
                }}
              >
                {a.initials}
              </div>
              <span
                className={`mt-1.5 w-full truncate text-center text-[0.55rem] leading-tight ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {a.name.split(" ").slice(-1)[0]}
              </span>
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}