import React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import WaButton from "@/components/site/WaButton";
import BrandSlideshow from "@/components/site/BrandSlideshow";
import { useLang } from "@/lib/i18n";

const up = (d) => ({ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] } });

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-5 px-5 py-6 sm:gap-8 sm:py-10 lg:min-h-[86vh] lg:grid-cols-2 lg:py-16">
      <div>
        <motion.p {...up(0)} className="btn-caps mb-3 text-primary sm:mb-5">{t("hero.eyebrow")}</motion.p>
        <motion.h1 {...up(0.15)} className="text-[1.75rem] leading-[1.08] sm:text-5xl md:text-7xl">
          {t("hero.t1")}<br /><span className="gold-text">{t("hero.t2")}</span>
        </motion.h1>
        <motion.p {...up(0.3)} className="mt-3 max-w-xl text-[0.9rem] text-muted-foreground sm:mt-4 sm:text-base">
          {t("hero.sub")}
        </motion.p>
        <motion.div {...up(0.45)} className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
          <WaButton text="Namaste Vastugrah, I wish to align my space with Vastugrah.">{t("hero.cta1")}</WaButton>
          <Link to="/services" className="btn-caps inline-flex min-h-[44px] items-center rounded-full border border-primary px-6 py-3 text-primary transition hover:bg-primary hover:text-primary-foreground">{t("hero.cta2")}</Link>
          <Link to="/kundli" className="btn-caps inline-flex min-h-[44px] items-center rounded-full border border-border px-6 py-3 text-foreground/80 transition hover:border-primary hover:text-primary">{t("hero.cta3")}</Link>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="floaty mx-auto mt-2 w-full max-w-[12.5rem] sm:mt-3 sm:max-w-[17rem] lg:mt-8 lg:max-w-sm">
        <BrandSlideshow />
      </motion.div>
    </section>
  );
}