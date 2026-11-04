import React from "react";
import { CalendarDays } from "lucide-react";
import AreaCard from "@/components/horoscope/AreaCard";
import LuckyGrid from "@/components/horoscope/LuckyGrid";
import WaButton from "@/components/site/WaButton";
import { PERIODS, SIGN_META, signName } from "@/components/horoscope/horoscopeData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/lib/i18n";

const PERIOD_KEY = {
  yesterday: "horoscope.yesterday",
  today: "horoscope.daily",
  tomorrow: "horoscope.tomorrow",
  week: "horoscope.week",
  month: "horoscope.month",
};

export default function HoroscopePanel({ index, period, data, onSignChange, onPeriodChange }) {
  const { t, lang } = useLang();
  const sign = signName(index, lang);
  const scope = period === "month" ? t("horoscope.monthlyWord") : period === "week" ? t("horoscope.weeklyWord") : t("horoscope.dailyWord");

  return (
    <div key={`${sign}-${period}`} className="animate-in fade-in slide-in-from-bottom-3 duration-500 rounded-[2rem] border border-border bg-card p-4 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl leading-tight sm:text-4xl">{data.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{data.range}</p>
        </div>
        <div className="w-full sm:w-56">
          <span className="btn-caps block text-[0.6rem] text-primary">{t("horoscope.changeSign")}</span>
          <Select value={String(index)} onValueChange={(v) => onSignChange(Number(v))}>
            <SelectTrigger className="mt-1 h-11 w-full rounded-full border-primary/40 bg-primary/10 px-4 text-sm font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {SIGN_META.map((m, i) => (
                <SelectItem key={m.sign} value={String(i)} className="rounded-xl">
                  {signName(i, lang)} ({m.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="no-bar mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPeriodChange(p.id)}
            aria-pressed={period === p.id}
            className={`min-h-[40px] shrink-0 rounded-full border px-4 text-sm transition ${
              period === p.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground/80 hover:border-primary"
            }`}
          >
            {t(PERIOD_KEY[p.id] ?? p.label)}
          </button>
        ))}
      </div>
      <div className="scroll-line mt-2" />

      <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary/70 px-3 py-1 text-xs text-foreground/80">
        <CalendarDays size={13} className="text-primary" /> {data.dateLabel}
      </p>

      <p className="btn-caps mt-4 text-[0.6rem] text-muted-foreground">{sign} {scope}</p>
      <p className="mt-2 text-foreground/85">{data.narrative}</p>

      <div className="mt-8">
        <h3 className="text-xl sm:text-2xl">{t("horoscope.byArea")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("horoscope.byAreaSub")}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {data.areas.map((area) => (
            <AreaCard key={area.key} sign={sign} area={area} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl sm:text-2xl">{t("horoscope.luckyFor")} {sign}</h3>
        <div className="mt-3">
          <LuckyGrid items={data.lucky} />
        </div>
      </div>

      <div className="mt-7 flex justify-center">
        <WaButton text={`Namaste Vastugrah, I want to talk to a ${sign} expert about my horoscope.`}>
          {t("horoscope.talkExpert")}
        </WaButton>
      </div>
    </div>
  );
}