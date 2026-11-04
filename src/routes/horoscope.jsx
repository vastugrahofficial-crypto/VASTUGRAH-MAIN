import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import SectionTitle from "@/components/site/SectionTitle";
import SignGrid from "@/components/horoscope/SignGrid";
import HoroscopePanel from "@/components/horoscope/HoroscopePanel";
import { horoscope } from "@/components/horoscope/horoscopeData";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/horoscope")({
  head: () => ({
    meta: [
      { title: "Daily Horoscope · Yesterday, Today, Tomorrow | Vastugrah" },
      { name: "description", content: "Read your daily, yesterday, tomorrow, weekly and monthly horoscope for all twelve moon signs, with lucky colour, number, auspicious time, tarot card and area-by-area guidance." },
    ],
  }),
  component: Horoscope,
});

function Horoscope() {
  const { t, lang } = useLang();
  const [idx, setIdx] = useState(0);
  const [period, setPeriod] = useState("today");
  const [anchor, setAnchor] = useState(null);

  useEffect(() => setAnchor(new Date()), []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <SectionTitle eyebrow={t("horoscope.eyebrow")} title={t("horoscope.title")} sub={t("horoscope.sub")} />

      <SignGrid active={idx} onPick={setIdx} />

      <div className="mt-8">
        {anchor ? (
          <HoroscopePanel
            index={idx}
            period={period}
            data={horoscope(idx, period, anchor, lang)}
            onSignChange={setIdx}
            onPeriodChange={setPeriod}
          />
        ) : (
          <div className="h-[420px] animate-pulse rounded-[2rem] border border-border bg-card/60" />
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">{t("horoscope.disclaimer")}</p>
    </div>
  );
}