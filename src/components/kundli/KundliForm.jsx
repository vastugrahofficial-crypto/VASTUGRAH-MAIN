import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import PlaceCombobox from "@/components/kundli/PlaceCombobox";
import { CITIES, TZ_OPTIONS, formatTz } from "@/lib/kundli/cities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/lib/i18n";

const FIELD = "mt-2 h-12 w-full rounded-full border border-border bg-background px-4 text-base outline-none transition focus:border-primary";
const LABEL = "text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground";

export default function KundliForm({ onSubmit, busy = false }) {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [cityIndex, setCityIndex] = useState("0");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [tz, setTz] = useState("5.5");
  const [error, setError] = useState("");

  const manual = cityIndex === "manual";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (busy) return;
    if (!date || !time) { setError(t("kform.errDates")); return; }
    const city = CITIES[Number(cityIndex)];
    const payload = {
      name,
      date,
      time,
      place: manual ? t("kform.manual") : city.name,
      lat: manual ? Number(lat) : city.lat,
      lon: manual ? Number(lon) : city.lon,
      tz: manual ? Number(tz) : city.tz,
    };
    if (manual && (lat === "" || lon === "" || !Number.isFinite(payload.lat) || !Number.isFinite(payload.lon))) {
      setError(t("kform.errCoords"));
      return;
    }
    if (Math.abs(payload.lat) > 90 || Math.abs(payload.lon) > 180) {
      setError(t("kform.errRange"));
      return;
    }
    setError("");
    // The page calculates the kundli (via the astrology API, with an in-app fallback)
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={LABEL}>{t("kform.name")}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("kform.namePh")} className={FIELD} maxLength={60} />
        </label>
        <label className="block">
          <span className={LABEL}>{t("kform.dob")}</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={FIELD} required />
        </label>
        <label className="block">
          <span className={LABEL}>{t("kform.tob")}</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={FIELD} required />
        </label>
        <div className="block sm:col-span-2">
          <span className={LABEL}>{t("kform.place")}</span>
          <PlaceCombobox value={cityIndex} onChange={setCityIndex} />
        </div>

        {manual && (
          <>
            <label className="block">
              <span className={LABEL}>{t("kform.lat")}</span>
              <input type="number" step="0.0001" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="28.6139" className={FIELD} />
            </label>
            <label className="block">
              <span className={LABEL}>{t("kform.lon")}</span>
              <input type="number" step="0.0001" value={lon} onChange={(e) => setLon(e.target.value)} placeholder="77.2090" className={FIELD} />
            </label>
            <div className="block sm:col-span-2">
              <span className={LABEL}>{t("kform.tz")}</span>
              <Select value={tz} onValueChange={setTz}>
                <SelectTrigger className="mt-2 h-12 w-full rounded-full border-border bg-background px-4 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {TZ_OPTIONS.map((v) => (
                    <SelectItem key={v} value={String(v)} className="rounded-xl">{formatTz(v)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="btn-caps mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-primary-foreground transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        <Sparkles size={16} /> {t("kform.submit")}
      </button>
      <p className="mt-3 text-xs text-muted-foreground">{t("kform.note")}</p>
    </form>
  );
}