import React from "react";
import { Link } from "@tanstack/react-router";
import SectionTitle from "@/components/site/SectionTitle";
import ServiceCard from "@/components/site/ServiceCard";
import { SERVICES } from "@/lib/site";
import { useLang } from "@/lib/i18n";

export default function ServicesPreview() {
  const { t } = useLang();

  return (
    <section className="mx-auto max-w-7xl px-5 pb-12 md:pb-16">
      <SectionTitle eyebrow={t("services.eyebrow")} title={t("services.title")} />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.slice(0, 6).map((s, i) => <ServiceCard key={s.title} s={s} i={i} />)}
      </div>
      <div className="mt-6 text-center">
        <Link to="/services" className="btn-caps inline-flex min-h-[44px] items-center rounded-full border border-primary px-8 py-3 text-primary transition hover:bg-primary hover:text-primary-foreground">{t("svc.all")}</Link>
      </div>
    </section>
  );
}