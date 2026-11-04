import React, { useState } from "react";
import { Download } from "lucide-react";
import ChartDiagram from "@/components/kundli/ChartDiagram";
import PlanetTable from "@/components/kundli/PlanetTable";
import DashaTable from "@/components/kundli/DashaTable";
import WaButton from "@/components/site/WaButton";
import { downloadKundliPdf } from "@/lib/kundli/report";
import { useLang } from "@/lib/i18n";

export default function KundliResult({ kundli }) {
  const { t, lang } = useLang();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handlePdf = async () => {
    setBusy(true);
    setError("");
    try {
      await downloadKundliPdf(kundli);
    } catch {
      setError("The PDF could not be created. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const facts = [
    [t("kres.lagna"), `${kundli.lagna.sign} ${kundli.lagna.degree}`],
    [t("kres.rashi"), kundli.moonSign.sign],
    [t("kres.nakshatra"), kundli.panchang.nakshatra],
    [t("kres.ayanamsa"), kundli.ayanamsa],
  ];
  const hi = lang === "hi";
  const panchang = [
    [hi ? "तिथि" : "Tithi", kundli.panchang.tithi],
    [hi ? "योग" : "Yoga", kundli.panchang.yoga],
    [hi ? "करण" : "Karana", kundli.panchang.karana],
    [hi ? "वार" : "Weekday", kundli.panchang.weekday],
    [hi ? "नक्षत्र स्वामी" : "Nakshatra lord", kundli.panchang.nakshatraLord],
    [hi ? "चल रही दशा" : "Current dasha", kundli.dasha.current],
  ];

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-2xl border border-primary/40 bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="btn-caps text-primary">{t("kres.janma")}</p>
            <h2 className="mt-1 text-3xl">{kundli.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {kundli.birth.date} · {kundli.birth.time} · {kundli.birth.place}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePdf}
              disabled={busy}
              className="btn-caps inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-5 text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              <Download size={16} /> {busy ? t("kres.preparing") : t("kres.download")}
            </button>
            <WaButton variant="outline" text={`Namaste Vastugrah, I generated my free kundli. Please guide me on my reading.`}>{t("kres.talk")}</WaButton>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-secondary/60 px-3 py-2">
              <dt className="text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kundli.charts.map((chart) => (
          <ChartDiagram key={chart.key} chart={chart} />
        ))}
      </div>

      <PlanetTable planets={kundli.planets} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-3 font-heading text-xl">{t("kres.panchang")}</h3>
          <dl className="grid grid-cols-2 gap-3">
            {panchang.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
                <dd className="text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <DashaTable dasha={kundli.dasha} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-2 font-heading text-xl">{t("kres.dosha")}</h3>
        <p className="text-sm text-muted-foreground">
          {kundli.dosha.manglik
            ? lang === "hi"
              ? `मांगलिक दोष है — मंगल लग्न से ${kundli.dosha.fromLagna}वें और चंद्र से ${kundli.dosha.fromMoon}वें भाव में है। उपाय पूर्ण पाठ के बाद तय करना उचित है।`
              : `Mangal Dosha is indicated — Mars sits in house ${kundli.dosha.fromLagna} from Lagna and house ${kundli.dosha.fromMoon} from the Moon. Remedies are best decided after a full reading.`
            : lang === "hi"
              ? "इस कुंडली में लग्न या चंद्र से मांगलिक दोष नहीं बनता।"
              : "No Mangal Dosha is formed from the Lagna or the Moon in this chart."}
        </p>
      </div>
    </div>
  );
}