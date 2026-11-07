import {
  ayanamsa, ascendant, dms, julianDay, karanaName, nakshatraOf, norm360,
  PLANET_ABBR, PLANET_NAMES, PLANET_SK, SIGNS_EN, SIGNS_SK,
  TITHIS, YOGAS, tropicalLongitudes,
} from "./astro";

export const DASHA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
export const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const YEAR_MS = 365.2425 * 86400000;

const navamsaSign = (lon) => Math.floor(norm360(lon) / (10 / 3)) % 12;
const dashamsaSign = (lon) => {
  const sign = Math.floor(norm360(lon) / 30);
  const part = Math.floor((norm360(lon) % 30) / 3);
  return sign % 2 === 0 ? (sign + part) % 12 : (sign + 8 + part) % 12;
};

const fmtDate = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

/**
 * Builds the full kundli object the UI expects from raw sidereal positions.
 *
 * raw = {
 *   ascLon:   sidereal ascendant longitude (0-360)
 *   lons:     { Sun: 0-360, Moon: ..., ... }  sidereal longitudes
 *   retro:    { Sun: false, ... }
 *   ayanDeg:  ayanamsa in degrees (display only)
 *   dasha:    optional [{ lord, start: Date, end: Date }] (from the API); computed locally if missing
 *   dashaCurrent: optional current mahadasha lord (from the API)
 *   d9, d10:  optional { planets: { Sun: signIndex0, ... }, asc: signIndex0 } from the API
 *   panchang: optional partial panchang overrides from the API
 *   manglik:  optional boolean from the API
 *   source:   "api" | "local"
 * }
 */
export function assembleKundli(input, raw) {
  const [year, month, day] = input.date.split("-").map(Number);
  const [hour, minute] = input.time.split(":").map(Number);
  const tz = Number(input.tz);
  const lat = Number(input.lat);
  const lon = Number(input.lon);

  const ascLon = norm360(raw.ascLon);
  const ascSign = Math.floor(ascLon / 30);
  const ascNak = nakshatraOf(ascLon);

  const planets = PLANET_NAMES.map((name) => {
    const longitude = norm360(raw.lons[name]);
    const sign = Math.floor(longitude / 30);
    const deg = longitude - sign * 30;
    const nak = nakshatraOf(longitude);
    const retro = name === "Rahu" || name === "Ketu" ? true : Boolean(raw.retro[name]);
    return {
      name,
      abbr: PLANET_ABBR[name],
      sanskrit: PLANET_SK[name],
      longitude,
      sign,
      signName: SIGNS_EN[sign],
      degreeText: dms(deg),
      nakshatra: nak.name,
      pada: nak.pada,
      nakshatraLord: nak.lord,
      retro,
      house: ((sign - ascSign + 12) % 12) + 1,
      bhava: Math.floor(norm360(longitude - ascLon) / 30) + 1,
      navamsa: raw.d9?.planets?.[name] ?? navamsaSign(longitude),
      dashamsa: raw.d10?.planets?.[name] ?? dashamsaSign(longitude),
    };
  });

  const byHouse = (predicate) => planets.filter(predicate).map((p) => ({ abbr: p.abbr, deg: Math.floor(p.longitude % 30), retro: p.retro }));
  const signHouses = (startSign, prop) =>
    Array.from({ length: 12 }, (_, i) => {
      const sign = (startSign + i) % 12;
      return { sign, planets: byHouse((p) => p[prop] === sign) };
    });

  const moon = planets.find((p) => p.name === "Moon");
  const charts = [
    { key: "d1", title: "Lagna Kundli", subtitle: "D-1 · Birth chart", houses: signHouses(ascSign, "sign") },
    { key: "moon", title: "Chandra Kundli", subtitle: "Moon chart", houses: signHouses(moon.sign, "sign") },
    { key: "d9", title: "Navamsa", subtitle: "D-9 · Marriage & dharma", houses: signHouses(raw.d9?.asc ?? navamsaSign(ascLon), "navamsa") },
    { key: "d10", title: "Dashamsa", subtitle: "D-10 · Career", houses: signHouses(raw.d10?.asc ?? dashamsaSign(ascLon), "dashamsa") },
    {
      key: "chalit",
      title: "Bhava Chalit",
      subtitle: "Equal-house cusps",
      houses: Array.from({ length: 12 }, (_, i) => ({ sign: (ascSign + i) % 12, planets: byHouse((p) => p.bhava === i + 1) })),
    },
  ];

  const moonNak = nakshatraOf(moon.longitude);
  const diff = norm360(moon.longitude - planets[0].longitude);
  const tithiIndex = Math.floor(diff / 12);
  const localPanchang = {
    tithi: `${tithiIndex < 15 ? "Shukla" : "Krishna"} ${TITHIS[tithiIndex]}`,
    yoga: YOGAS[Math.floor(norm360(moon.longitude + planets[0].longitude) / (360 / 27))],
    karana: karanaName(Math.floor(diff / 6)),
    weekday: WEEKDAYS[new Date(year, month - 1, day).getDay()],
    nakshatra: `${moonNak.name} (Pada ${moonNak.pada})`,
    nakshatraLord: moonNak.lord,
  };
  const panchang = { ...localPanchang, ...(raw.panchang || {}) };

  // Vimshottari dasha: from the API when provided, otherwise computed from the Moon's nakshatra
  const periods = [];
  if (raw.dasha && raw.dasha.length) {
    raw.dasha.forEach(({ lord, start, end }) => {
      const years = (end.getTime() - start.getTime()) / YEAR_MS;
      periods.push({ lord, from: fmtDate(start), to: fmtDate(end), years: Math.round(years * 100) / 100, start });
    });
  } else {
    const frac = (moon.longitude % (360 / 27)) / (360 / 27);
    const lordIndex = moonNak.index % 9;
    let cursor = new Date(year, month - 1, day, hour, minute);
    for (let k = 0; k < 9; k += 1) {
      const idx = (lordIndex + k) % 9;
      const years = DASHA_YEARS[idx] * (k === 0 ? 1 - frac : 1);
      const end = new Date(cursor.getTime() + years * YEAR_MS);
      periods.push({ lord: DASHA_LORDS[idx], from: fmtDate(cursor), to: fmtDate(end), years: Math.round(years * 100) / 100, start: cursor });
      cursor = end;
    }
  }
  const now = new Date();
  const current = raw.dashaCurrent || ([...periods].reverse().find((p) => p.start <= now)?.lord ?? periods[0].lord);

  const mars = planets.find((p) => p.name === "Mars");
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const fromMoon = ((mars.sign - moon.sign + 12) % 12) + 1;
  const dosha = {
    manglik: typeof raw.manglik === "boolean" ? raw.manglik : manglikHouses.includes(mars.house) || manglikHouses.includes(fromMoon),
    fromLagna: mars.house,
    fromMoon,
  };

  return {
    name: input.name?.trim() || "Seeker",
    source: raw.source || "local",
    birth: {
      date: `${day} ${MONTHS[month - 1]} ${year}`,
      time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      place: input.place,
      lat,
      lon,
      tz,
    },
    ayanamsa: dms(norm360(raw.ayanDeg)),
    lagna: { sign: SIGNS_EN[ascSign], signNumber: ascSign + 1, sanskrit: SIGNS_SK[ascSign], degree: dms(ascLon % 30), nakshatra: ascNak.name, pada: ascNak.pada },
    moonSign: { sign: SIGNS_EN[moon.sign], sanskrit: SIGNS_SK[moon.sign], degree: moon.degreeText },
    planets,
    charts,
    panchang,
    dasha: { periods: periods.map(({ start, ...p }) => p), current, balance: periods[0] },
    dosha,
  };
}

/** Original in-app (offline) calculation. Used as the fallback when the API is unavailable. */
export function computeKundli(input) {
  const [year, month, day] = input.date.split("-").map(Number);
  const [hour, minute] = input.time.split(":").map(Number);
  const tz = Number(input.tz);
  const lat = Number(input.lat);
  const lon = Number(input.lon);

  const jd = julianDay(year, month, day, hour + minute / 60 - tz);
  const ayan = ayanamsa(jd);
  const t1 = tropicalLongitudes(jd);
  const t2 = tropicalLongitudes(jd + 0.5);
  const ayan2 = ayanamsa(jd + 0.5);

  const lons = {};
  const retro = {};
  PLANET_NAMES.forEach((name) => {
    const longitude = norm360(t1[name] - ayan);
    const delta = norm360(norm360(t2[name] - ayan2) - longitude);
    const motion = delta > 180 ? delta - 360 : delta;
    lons[name] = longitude;
    retro[name] = name === "Rahu" || name === "Ketu" ? true : motion < 0;
  });

  return assembleKundli(input, {
    ascLon: norm360(ascendant(jd, lat, lon) - ayan),
    lons,
    retro,
    ayanDeg: ayan,
    source: "local",
  });
}