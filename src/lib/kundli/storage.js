const KEY = "vastugrah.chart";

/** Stores only what the AI astrologer needs — never the whole report. */
export function saveChart(kundli) {
  if (typeof window === "undefined" || !kundli) return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({
        name: kundli.name || "Guest",
        date: kundli.birth.date,
        time: kundli.birth.time,
        place: kundli.birth.place,
        lagna: `${kundli.lagna.sign} ${kundli.lagna.degree}`,
        rashi: kundli.moonSign.sign,
        nakshatra: kundli.panchang.nakshatra,
        dasha: kundli.dasha.current,
      })
    );
  } catch {
    /* storage unavailable — the report still renders on this page */
  }
}

export function readChart() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}