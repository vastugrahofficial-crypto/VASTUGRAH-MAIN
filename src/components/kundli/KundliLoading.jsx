import React, { useEffect, useState } from "react";
import ZodiacWheel from "@/components/site/ZodiacWheel";
import { useLang } from "@/lib/i18n";

const STEPS = {
  en: [
    "Reading your birth date and exact time…",
    "Placing the nine grahas by Lahiri ayanamsa…",
    "Drawing lagna, chandra and varga charts…",
    "Mapping bhavas and Vimshottari dasha…",
  ],
  hi: [
    "जन्म तिथि और समय पढ़ा जा रहा है…",
    "लाहिरी अयनांश से नवग्रह स्थापित हो रहे हैं…",
    "लग्न, चंद्र और वर्ग कुंडली बन रही है…",
    "भाव और विंशोत्तरी दशा जोड़ी जा रही है…",
  ],
};

export default function KundliLoading() {
  const { lang } = useLang();
  const steps = STEPS[lang] ?? STEPS.en;
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((v) => (v + 1) % steps.length), 600);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="relative mx-auto mt-8 flex max-w-md flex-col items-center overflow-hidden rounded-2xl border border-primary/30 bg-card px-6 py-9 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 50% 42%, hsl(var(--primary) / 0.18), transparent 62%)" }} />

      <div className="relative flex h-32 w-32 items-center justify-center">
        <ZodiacWheel className="chakra-spin h-full w-full text-primary/80" />
        <div className="pulse-ring absolute h-16 w-16 rounded-full border border-primary/60" />
      </div>

      <p className="relative mt-5 font-heading text-2xl">{lang === "hi" ? "आपकी कुंडली बन रही है" : "Calculating your kundli"}</p>
      <p className="relative mt-1 min-h-[1.4rem] text-sm text-muted-foreground">{steps[step]}</p>

      <div className="relative mt-4 h-1 w-40 overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  );
}