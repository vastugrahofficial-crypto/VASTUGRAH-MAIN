// Vedic astronomy helpers: Lahiri (Chitrapaksha) ayanamsa, mean equinox of date.
// Planetary positions use JPL approximate Keplerian elements (valid 1800-2050);
// the Moon uses Meeus' truncated ELP-2000 series. Accuracy: a few arc-minutes.

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

export const norm360 = (x) => ((x % 360) + 360) % 360;

export const SIGNS_EN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
export const SIGNS_SK = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
export const SIGN_SHORT = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];
export const NAKSHATRA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

export const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
];

export const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula",
  "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
];

export const PLANET_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
export const PLANET_ABBR = { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke" };
export const PLANET_SK = { Sun: "Surya", Moon: "Chandra", Mars: "Mangal", Mercury: "Budha", Jupiter: "Guru", Venus: "Shukra", Saturn: "Shani", Rahu: "Rahu", Ketu: "Ketu" };

export function julianDay(year, month, day, utHours) {
  let y = year;
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5 + utHours / 24;
}

export function ayanamsa(jd) {
  const year = 2000 + (jd - 2451545.0) / 365.25;
  return 23.85319 + 0.0139694 * (year - 2000);
}

const ELEMENTS = {
  Mercury: { a: [0.38709927, 0.00000037], e: [0.20563593, 0.00001906], i: [7.00497902, -0.00594749], L: [252.2503235, 149472.67411175], w: [77.45779628, 0.16047689], n: [48.33076593, -0.12534081] },
  Venus: { a: [0.72333566, 0.0000039], e: [0.00677672, -0.00004107], i: [3.39467605, -0.0007889], L: [181.9790995, 58517.81538729], w: [131.60246718, 0.00268329], n: [76.67984255, -0.27769418] },
  Earth: { a: [1.00000261, 0.00000562], e: [0.01671123, -0.00004392], i: [-0.00001531, -0.01294668], L: [100.46457166, 35999.37244981], w: [102.93768193, 0.32327364], n: [0, 0] },
  Mars: { a: [1.52371034, 0.00001847], e: [0.0933941, 0.00007882], i: [1.84969142, -0.00813131], L: [-4.55343205, 19140.30268499], w: [-23.94362959, 0.44441088], n: [49.55953891, -0.29257343] },
  Jupiter: { a: [5.202887, -0.00011607], e: [0.04838624, -0.00013253], i: [1.30439695, -0.00183714], L: [34.39644051, 3034.74612775], w: [14.72847983, 0.21252668], n: [100.47390909, 0.20469106] },
  Saturn: { a: [9.53667594, -0.0012506], e: [0.05386179, -0.00050991], i: [2.48599187, 0.00193609], L: [49.95424423, 1222.49362201], w: [92.59887831, -0.41897216], n: [113.66242448, -0.28867794] },
};

function heliocentric(name, T) {
  const el = ELEMENTS[name];
  const a = el.a[0] + el.a[1] * T;
  const e = el.e[0] + el.e[1] * T;
  const inc = (el.i[0] + el.i[1] * T) * D2R;
  const L = el.L[0] + el.L[1] * T;
  const wbar = el.w[0] + el.w[1] * T;
  const nodeDeg = el.n[0] + el.n[1] * T;
  const node = nodeDeg * D2R;
  const argPeri = (wbar - nodeDeg) * D2R;

  const M = norm360(L - wbar) * D2R;
  let E = M;
  for (let k = 0; k < 9; k += 1) {
    E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  }
  const xv = a * (Math.cos(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const r = Math.hypot(xv, yv);
  const u = Math.atan2(yv, xv) + argPeri;
  return {
    x: r * (Math.cos(node) * Math.cos(u) - Math.sin(node) * Math.sin(u) * Math.cos(inc)),
    y: r * (Math.sin(node) * Math.cos(u) + Math.cos(node) * Math.sin(u) * Math.cos(inc)),
  };
}

const MOON_TERMS = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116],
  [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758],
  [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720], [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036], [2, 0, 2, 0, 3994],
  [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
  [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048],
  [2, 0, 1, -2, -1773], [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110], [3, 0, -1, 0, -892],
];

function moonLongitude(T) {
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T ** 3) / 538841 - (T ** 4) / 65194000;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + (T ** 3) / 545868 - (T ** 4) / 113065000;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T ** 3) / 24490000;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + (T ** 3) / 69699 - (T ** 4) / 14712000;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T - (T ** 3) / 3526000 + (T ** 4) / 863310000;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  let sum = 0;
  MOON_TERMS.forEach(([d, m, mp, f, c]) => {
    let k = c;
    if (Math.abs(m) === 1) k *= E;
    if (Math.abs(m) === 2) k *= E * E;
    sum += k * Math.sin((d * D + m * M + mp * Mp + f * F) * D2R);
  });
  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.29 * T;
  sum += 3958 * Math.sin(A1 * D2R) + 1962 * Math.sin((Lp - F) * D2R) + 318 * Math.sin(A2 * D2R);
  return norm360(Lp + sum / 1e6);
}

// Tropical (mean equinox of date) longitudes in degrees.
export function tropicalLongitudes(jd) {
  const T = (jd - 2451545.0) / 36525;
  const pre = (5029.0966 * T + 1.11113 * T * T) / 3600;
  const earth = heliocentric("Earth", T);
  const out = {};
  out.Sun = norm360(Math.atan2(-earth.y, -earth.x) * R2D + pre);
  ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"].forEach((name) => {
    const p = heliocentric(name, T);
    out[name] = norm360(Math.atan2(p.y - earth.y, p.x - earth.x) * R2D + pre);
  });
  out.Moon = moonLongitude(T);
  const node = norm360(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T);
  out.Rahu = node;
  out.Ketu = norm360(node + 180);
  return out;
}

export function ascendant(jd, lat, lon) {
  const T = (jd - 2451545.0) / 36525;
  const gmst = norm360(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
  const ramc = norm360(gmst + lon) * D2R;
  const eps = (23.439291 - 0.0130042 * T) * D2R;
  const phi = lat * D2R;
  const y = Math.cos(ramc);
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  return norm360(Math.atan2(y, x) * R2D);
}

export function nakshatraOf(lon) {
  const size = 360 / 27;
  const l = norm360(lon);
  const index = Math.floor(l / size) % 27;
  const pada = Math.floor((l % size) / (size / 4)) + 1;
  return { index, name: NAKSHATRAS[index], pada, lord: NAKSHATRA_LORDS[index % 9] };
}

export function karanaName(k) {
  if (k === 0) return "Kimstughna";
  if (k >= 57) return ["Shakuni", "Chatushpada", "Naga"][k - 57];
  return ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"][(k - 1) % 7];
}

export function dms(deg) {
  const d = Math.floor(deg);
  const mf = (deg - d) * 60;
  const m = Math.floor(mf);
  const s = Math.round((mf - m) * 60);
  return `${d}\u00b0${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}"`;
}