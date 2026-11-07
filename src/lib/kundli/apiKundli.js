import { callAstroApi } from "@/lib/server-fns";
import { ayanamsa, julianDay, PLANET_NAMES } from "./astro";
import { DASHA_LORDS, assembleKundli } from "./kundli";

/**
 * Kundli calculated by FreeAstroAPI (freeastroapi.com) with ONE request:
 * POST /api/v2/vedic/calculate -> chart, D9/D10, Vimshottari dasha, yogas (Manglik), panchang.
 * The chart diagrams are drawn from the sign placements the API returns.
 * Throws on any problem so the caller can fall back to the in-app calculation.
 */

const cache = new Map(); // same birth details = no repeat API requests
const pad = (n) => String(n).padStart(2, "0");

function buildPayload(input) {
  const [year, month, day] = input.date.split("-").map(Number);
  const [hour, minute] = input.time.split(":").map(Number);
  const tz = Number(input.tz);
  const now = new Date();
  return {
    year,
    month,
    day,
    hour,
    minute,
    lat: Number(input.lat),
    lng: Number(input.lon),
    // Indian standard time is sent explicitly; anything else is resolved from the coordinates.
    tz_str: tz === 5.5 ? "Asia/Kolkata" : "AUTO",
    ayanamsha: "lahiri",
    house_system: "whole_sign",
    node_type: "mean",
    vargas: [1, 9, 10],
    include_yogas: true,
    include_panchang: true,
    include_shadbala: false,
    include_ashtakavarga: false,
    dasha_levels: 1,
    reference_date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
  };
}

function parseChart(res) {
  const chart = res?.chart;
  if (!chart?.ascendant || !Array.isArray(chart.planets)) throw new Error("chart: unexpected response");

  const ascLon = Number(chart.ascendant.degree);
  if (!Number.isFinite(ascLon)) throw new Error("chart: bad ascendant degree");

  const byName = {};
  chart.planets.forEach((p) => {
    byName[p.name] = p;
  });

  const lons = {};
  const retro = {};
  const missing = [];
  PLANET_NAMES.forEach((n) => {
    const p = byName[n];
    const lon = Number(p?.absolute_degree);
    if (!p || !Number.isFinite(lon)) {
      missing.push(n);
      return;
    }
    lons[n] = lon;
    retro[n] = Boolean(p.is_retrograde);
  });
  if (missing.length) throw new Error(`chart: missing ${missing.join(", ")}`);
  return { ascLon, lons, retro };
}

function parseVargas(res) {
  const v = res?.vargas?.vargas;
  if (!v) return {};
  const pick = (d) => {
    const ids = d?.row_sign_ids;
    if (!ids) return null;
    const planets = {};
    PLANET_NAMES.forEach((n) => {
      if (Number.isFinite(Number(ids[n]))) planets[n] = Number(ids[n]) - 1;
    });
    const asc = Number.isFinite(Number(ids.Ascendant)) ? Number(ids.Ascendant) - 1 : undefined;
    return { planets, asc };
  };
  return { d9: pick(v.D9), d10: pick(v.D10) };
}

const toDate = (s) => {
  if (!s) return null;
  const d = new Date(`${String(s).slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

function parseDasha(res) {
  const d = res?.vimshottari_dasha;
  const periods = (d?.timeline || [])
    .filter((p) => p.level === "Mahadasha" && DASHA_LORDS.includes(p.lord))
    .map((p) => ({ lord: p.lord, start: toDate(p.start), end: toDate(p.end) }))
    .filter((p) => p.start && p.end);
  if (periods.length < 5) throw new Error("dasha: unexpected response");
  periods.sort((a, b) => a.start - b.start);
  const current = (d.active_periods || []).find((p) => p.level === "Mahadasha")?.lord;
  return { dasha: periods.slice(0, 9), dashaCurrent: current };
}

function parsePanchang(res) {
  const p = res?.panchang;
  if (!p) return undefined;
  const t = p.request_time_panchang || {}; // values at the exact birth time
  const out = {};
  const tithi = t.tithi || p.tithi;
  if (tithi?.name) out.tithi = `${tithi.paksha || ""} ${tithi.name}`.trim();
  const yoga = t.yoga || p.yoga;
  if (yoga?.name) out.yoga = yoga.name;
  const karana = t.karana || p.karanas?.[0];
  if (karana?.name) out.karana = karana.name;
  if (p.weekday?.name) out.weekday = p.weekday.name;
  const nak = t.nakshatra || p.nakshatra;
  if (nak?.name) {
    out.nakshatra = `${nak.name} (Pada ${nak.pada})`;
    if (nak.lord) out.nakshatraLord = nak.lord;
  }
  return out;
}

export async function computeKundliViaApi(input) {
  const key = JSON.stringify([input.date, input.time, Number(input.lat), Number(input.lon), Number(input.tz)]);

  let raw = cache.get(key);
  if (!raw) {
    const res = await callAstroApi({ data: { endpoint: "api/v2/vedic/calculate", payload: buildPayload(input) } });
    if (!res || res.error) throw new Error(`calculate: ${res?.error || "empty response"}`);
    if (import.meta.env?.DEV) console.info("[Kundli] raw response from FreeAstroAPI:", res);

    const positions = parseChart(res);
    const { d9, d10 } = parseVargas(res);
    const { dasha, dashaCurrent } = parseDasha(res);
    const manglikYoga = res?.yogas?.yogas?.find((y) => y.id === "manglik_dosha");

    const [year, month, day] = input.date.split("-").map(Number);
    const [hour, minute] = input.time.split(":").map(Number);
    const jd = julianDay(year, month, day, hour + minute / 60 - Number(input.tz));

    raw = {
      ...positions,
      d9,
      d10,
      dasha,
      dashaCurrent,
      panchang: parsePanchang(res),
      manglik: typeof manglikYoga?.active === "boolean" ? manglikYoga.active : undefined,
      ayanDeg: ayanamsa(jd), // display value only
      source: "api",
    };
    cache.set(key, raw);
  }

  return assembleKundli(input, raw);
}