import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { waLink } from "@/lib/site";

const exp = (a, lang) => (lang === "hi" ? a.experience.replace("years", "वर्ष") : a.experience);

/**
 * The selected astrologer: the portrait fills the whole panel, with the
 * credentials laid over its lower edge and one consult action.
 * If the astrologer has a `photo`, it is shown; otherwise the coloured initials are used.
 */
export default function AstrologerCard({ a, lang, consult }) {
  const expertise = lang === "hi" ? a.expertiseHi : a.expertise;

  return (
    <motion.div
      key={a.name}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 mx-auto w-full max-w-[21rem] overflow-hidden rounded-2xl border border-primary/50 shadow-[0_24px_50px_-30px_hsl(var(--primary))]"
    >
      <div
        className="relative h-[21rem] w-full sm:h-[24rem]"
        style={{ background: `linear-gradient(150deg, ${a.accent}, ${a.accent}dd 45%, ${a.accent}99)` }}
      >
        {a.photo ? (
          // object-cover keeps the photo's proportions (no stretching); photoFocus picks the visible part
          <img
            src={a.photo}
            alt={a.name}
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-cover"
            style={{ objectPosition: a.photoFocus || "50% 20%" }}
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-25"
              style={{ backgroundImage: "radial-gradient(circle at 50% 32%, #fff 0, transparent 55%)" }}
            />
            <span className="absolute inset-x-0 top-[26%] text-center font-heading text-[5.5rem] leading-none text-white/90 sm:text-[6.5rem]">
              {a.initials}
            </span>
          </>
        )}

        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent ${a.photo ? "h-[58%]" : "h-[78%]"}`}
        />

        <div className="absolute inset-x-0 bottom-0 px-3.5 pb-3.5 text-center text-white">
          <p className="font-heading text-xl leading-tight sm:text-2xl">{a.name}</p>
          <p className="text-[11px] leading-snug text-white/75">{lang === "hi" ? a.titleHi : a.title}</p>
          <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-primary">
            <Star size={10} fill="currentColor" strokeWidth={0} /> {a.rating} · {exp(a, lang)}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {expertise.map((tag) => (
              <span key={tag} className="rounded-full bg-white/12 px-2 py-0.5 text-[10px] text-primary">
                {tag}
              </span>
            ))}
          </div>
          <a
            href={waLink(`Namaste Vastugrah, I would like to consult ${a.name} (${a.title}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-caps mt-2.5 inline-flex min-h-[34px] w-full items-center justify-center rounded-full bg-primary px-4 text-[0.6rem] text-primary-foreground transition hover:opacity-90"
          >
            {consult}
          </a>
        </div>
      </div>
    </motion.div>
  );
}