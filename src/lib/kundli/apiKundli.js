import { callAstroApi } from "@/lib/server-fns";
import { ayanamsa, julianDay, PLANET_NAMES } from "./astro";
import { DASHA_LORDS, assembleKundli } from "./kundli";

/**
 * Kundli calculated by FreeAstrologyAPI (planets + Vimshottari dasha).
 * Everything else (charts layout, panchang, sign/nakshatra lookups) is derived from the
 * longitudes the API returns. Throws on any problem so the caller can fall back to the
 * in-app calculation.
 */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cache = new Map(); // same birth details = no repeat API requests

function buildPayload(input) {
  const [year, month, date] = input.date.split("-").map(Number);
  const [hours, minutes] = input.time.split(":").map(Number);
  const settings = { observation_point: "geocentric", ayanamsha: "lahiri" };
  return {
    year,
    month,
    date,
    hours,
    minutes,
    seconds: 0,
    latitude: Number(input.lat),
    longitude: Number(input.lon),
    timezone: Number(input.tz),
    config: settings, // some endpoints read "config"
    settings, // others read "settings"
  };
}

async function post(endpoint, payload) {
  const res = await callAstroApi({ data: { endpoint, payload } });
  if (!res || res.error) throw new Error(`${endpoint}: ${res?.error || "empty response"}`);
  if (import.meta.env?.DEV) console.info(`[Kundli] raw response from ${endpoint}:`, res);
  return res;
}

const parseMaybeJson = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

/** Finds every { name, fullDegree, ... } object anywhere inside the planets response. */
function parsePlanets(res) {
  const output = parseMaybeJson(res?.output);
  const found = {};
  const visit = (v) => {
    if (!v || typeof v !== "object") return;
    if (typeof v.name === "string" && v.fullDegree !== undefined) {
      found[v.name] = v;
      return;
    }
    Object.values(v).forEach(visit);
  };
  visit(output);

  const missing = ["Ascendant", ...PLANET_NAMES].filter((n) => found[n] === undefined);
  if (missing.length) throw new Error(`planets: missing ${missing.join(", ")}`);

  const lons = {};
  const retro = {};
  PLANET_NAMES.forEach((n) => {
    const lon = Number(found[n].fullDegree);
    if (!Number.isFinite(lon)) throw new Error(`planets: bad degree for ${n}`);
    lons[n] = lon;
    retro[n] = String(found[n].isRetro).toLowerCase() === "true";
  });
  const ascLon = Number(found.Ascendant.fullDegree);
  if (!Number.isFinite(ascLon)) throw new Error("planets: bad Ascendant degree");
  return { ascLon, lons, retro };
}

const toDate = (s) => {
  if (!s) return null;
  const d = new Date(String(s).replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
};

/** Reads the Vimshottari maha-dasha list: [{ lord, start, end }]. */
function parseDasha(res) {
  const output = parseMaybeJson(res?.output);
  const periods = [];
  const visit = (v, key) => {
    if (!v || typeof v !== "object") return;
    const lord = v.Lord || v.lord || v.planet || v.name || key;
    const start = toDate(v.start_time ?? v.start ?? v.from);
    const end = toDate(v.end_time ?? v.end ?? v.to);
    if (DASHA_LORDS.includes(lord) && start && end) {
      periods.push({ lord, start, end });
      return;
    }
    Object.entries(v).forEach(([k, child]) => visit(child, k));
  };
  visit(output);

  if (periods.length < 5) throw new Error("dasha: unexpected response");
  periods.sort((a, b) => a.start - b.start);
  return periods.slice(0, 9);
}

export async function computeKundliViaApi(input) {
  const key = JSON.stringify([input.date, input.time, Number(input.lat), Number(input.lon), Number(input.tz)]);

  let raw = cache.get(key);
  if (!raw) {
    const payload = buildPayload(input);

    const planetsRes = await post("planets", payload);
    const positions = parsePlanets(planetsRes);

    await sleep(1100); // the API allows about 1 request per second

    const dashaRes = await post("vimsottari/maha-dasas", payload);
    const dasha = parseDasha(dashaRes);

    const [year, month, day] = input.date.split("-").map(Number);
    const [hour, minute] = input.time.split(":").map(Number);
    const jd = julianDay(year, month, day, hour + minute / 60 - Number(input.tz));

    raw = { ...positions, dasha, ayanDeg: ayanamsa(jd), source: "api" };
    cache.set(key, raw);
  }

  return assembleKundli(input, raw);
}