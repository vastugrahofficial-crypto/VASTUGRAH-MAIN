import React from "react";
import { Link } from "@tanstack/react-router";
import Reveal from "@/components/site/Reveal";
import WaButton from "@/components/site/WaButton";
import { useLang } from "@/lib/i18n";

export default function CtaBand() {
  const { t } = useLang();

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 text-center md:py-16">
      <Reveal>
        <h2 className="text-4xl md:text-6xl">{t("cta.title")}</h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{t("cta.sub")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <WaButton text="Namaste Vastugrah, I would like to book a consultation.">{t("cta.wa")}</WaButton>
          <Link to="/contact" className="btn-caps inline-flex min-h-[44px] items-center rounded-full border border-primary px-6 py-3 text-primary transition hover:bg-primary hover:text-primary-foreground">{t("cta.enquiry")}</Link>
        </div>
      </Reveal>
    </section>
  );
}