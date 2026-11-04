import { addDays, format, startOfWeek, endOfWeek, startOfMonth } from "date-fns";
import {
  SIGN_HI,
  COLOR_HI,
  MOODS_HI,
  AREA_LABELS_HI,
  LUCKY_LABELS_HI,
  NARRATIVE_HI,
  AREA_TEXT_HI,
  DAYS_HI,
  MONTHS_HI,
  PERIOD_WORDS_HI,
} from "@/components/horoscope/horoscopeHindi";

const COLOR_NAMES = {
  "#E2564A": "Red", "#F0A03A": "Marigold", "#7BA05B": "Green", "#D9A9A0": "Rose",
  "#9FB8D9": "Pearl Blue", "#E8E3D3": "Ivory", "#D9A62E": "Gold", "#C0651F": "Copper",
  "#8FA17A": "Olive", "#D9C9A8": "Tan", "#C9A6C9": "Lilac", "#8A6A8A": "Mauve",
  "#8C2F39": "Maroon", "#3B2A3B": "Indigo", "#C9973B": "Turmeric", "#5C4A2E": "Bronze",
  "#5C6B73": "Slate", "#2F3A3F": "Charcoal", "#4F86C6": "Sky Blue", "#9CC3E6": "Powder Blue",
  "#7C9CBF": "Sea Blue", "#C9B184": "Sand",
};

export const PERIODS = [
  { id: "yesterday", label: "Yesterday" },
  { id: "today", label: "Daily" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "week", label: "Week" },
  { id: "month", label: "Monthly" },
];

export const SIGN_META = [
  { sign: "Aries", range: "Mar 21 – Apr 19", ruler: "Mars", stone: "Red Coral (Moonga)", tarot: "The Emperor", symbol: "Ram", colors: ["#E2564A", "#F0A03A"], number: 9 },
  { sign: "Taurus", range: "Apr 20 – May 20", ruler: "Venus", stone: "Emerald (Panna)", tarot: "The Hierophant", symbol: "Bull", colors: ["#7BA05B", "#D9A9A0"], number: 6 },
  { sign: "Gemini", range: "May 21 – Jun 20", ruler: "Mercury", stone: "Emerald (Panna)", tarot: "The Lovers", symbol: "Twins", colors: ["#F0A03A", "#6B21A8"], number: 2 },
  { sign: "Cancer", range: "Jun 21 – Jul 22", ruler: "Moon", stone: "Pearl (Moti)", tarot: "The Chariot", symbol: "Crab", colors: ["#9FB8D9", "#E8E3D3"], number: 7 },
  { sign: "Leo", range: "Jul 23 – Aug 22", ruler: "Sun", stone: "Ruby (Manik)", tarot: "Strength", symbol: "Lion", colors: ["#D9A62E", "#C0651F"], number: 1 },
  { sign: "Virgo", range: "Aug 23 – Sep 22", ruler: "Mercury", stone: "Emerald (Panna)", tarot: "The Hermit", symbol: "Maiden", colors: ["#8FA17A", "#D9C9A8"], number: 5 },
  { sign: "Libra", range: "Sep 23 – Oct 22", ruler: "Venus", stone: "Diamond (Heera)", tarot: "Justice", symbol: "Scales", colors: ["#C9A6C9", "#8A6A8A"], number: 6 },
  { sign: "Scorpio", range: "Oct 23 – Nov 21", ruler: "Mars", stone: "Red Coral (Moonga)", tarot: "The Tower", symbol: "Scorpion", colors: ["#8C2F39", "#3B2A3B"], number: 8 },
  { sign: "Sagittarius", range: "Nov 22 – Dec 21", ruler: "Jupiter", stone: "Yellow Sapphire (Pukhraj)", tarot: "Temperance", symbol: "Archer", colors: ["#C9973B", "#5C4A2E"], number: 3 },
  { sign: "Capricorn", range: "Dec 22 – Jan 19", ruler: "Saturn", stone: "Blue Sapphire (Neelam)", tarot: "The World", symbol: "Goat", colors: ["#5C6B73", "#2F3A3F"], number: 8 },
  { sign: "Aquarius", range: "Jan 20 – Feb 18", ruler: "Saturn", stone: "Blue Sapphire (Neelam)", tarot: "The Star", symbol: "Water Bearer", colors: ["#4F86C6", "#9CC3E6"], number: 4 },
  { sign: "Pisces", range: "Feb 19 – Mar 20", ruler: "Jupiter", stone: "Yellow Sapphire (Pukhraj)", tarot: "The Moon", symbol: "Fish", colors: ["#7C9CBF", "#C9B184"], number: 3 },
];

const MOODS = ["Calm", "Focused", "Nervous", "Optimistic", "Reflective", "Restless", "Grounded", "Inspired"];

const NARRATIVE = {
  daily: [
    "A steady day, but not a passive one. {ruler} asks you to finish what you started before opening something new — the middle of the day carries the clearest decisions.",
    "Two conversations matter more than the rest today. Speak plainly, keep your pace, and let {ruler} handle the timing rather than forcing it.",
    "The day begins with a small delay and ends better than it started. Keep one pending matter open on purpose; it needs tomorrow's clarity, not today's pressure.",
    "Momentum is available, direction is not automatic. Choose the single task that would make the week easier and give it your first hours, not your last.",
    "An old doubt returns with a new answer. That is your instinct catching up with experience — trust it, and let {ruler} steady the rest.",
  ],
  week: [
    "The week has a clear shape: early days for planning and repair, the middle for pushing one important matter forward, and the end for consolidating. {ruler} rewards the person who finishes rather than the one who starts again.",
    "Expect one interruption that turns out to be useful. A delayed reply or a changed plan quietly protects you — do not fight the rescheduling.",
    "Money and attention both need a budget this week. Decide where your energy goes before the week decides for you, and keep one evening completely free.",
    "A relationship or partnership asks for a straight answer. Give it plainly and early in the week; by the weekend the same conversation becomes unnecessarily heavy.",
  ],
  month: [
    "This month favours consolidation over expansion. Finish the unfinished, simplify one commitment, and keep your largest decision tied to a date you can defend. {ruler} gives progress in instalments this month.",
    "The first half of the month brings information; the second half brings the chance to act on it. Do not spend the early weeks signing what the later weeks would have negotiated better.",
    "A cycle closes this month in your work or your home. Let it close cleanly — the next opening arrives because you made room for it, not because you pushed harder.",
    "Health, money and time all respond to routine this month. Small daily discipline will outperform one large effort, and {ruler} keeps steady while you do it.",
  ],
};

const AREA_TEXT = {
  daily: {
    love: [
      "Something small could go wrong in your relationships today, but it may teach you something about your partner. An honest five minutes beats a long silence.",
      "Warmth returns easily today. Say the thing you have been rehearsing in your head — it will land better than you expect.",
      "A misunderstanding clears once you stop defending your side. Listen first, then answer, and the evening softens.",
    ],
    finance: [
      "You may need to say no to someone asking for financial help today. With {ruler} strong, keep generosity planned rather than impulsive.",
      "A recurring expense can be trimmed today with very little effort. Fix it now, before the month-end pressure returns.",
      "Good day for paperwork and pending payments. Do not sign anything you have not read twice, even if it feels routine.",
    ],
    career: [
      "{ruler} could give you a chance to show what you are capable of at work. If you have been sitting on a creative idea, this is the day to table it.",
      "A senior notices the detail you added quietly. Keep going — the recognition arrives late but arrives.",
      "One task is taking longer than promised. Communicate the new timeline before it is asked for, and the day stays calm.",
    ],
    health: [
      "The day's energy may bring ups and downs, so take care of both mental and physical health. If something has been nagging you, book it rather than postponing it.",
      "Sleep and digestion are your two indicators today. Keep meals simple and the evening early.",
      "A little movement will reset your mood faster than more caffeine. Ten minutes outdoors is enough.",
    ],
  },
  week: {
    love: [
      "Midweek is the honest window for a difficult but necessary conversation. Keep it short and specific, and avoid re-litigating the past.",
      "Someone from your past re-enters the picture through a message. Reply with the version of yourself that exists today.",
    ],
    finance: [
      "The week rewards tightening, not expanding. One subscription, one loan instalment, one clear budget line will do more than a new plan.",
      "Unexpected money arrives late in the week, but it arrives. Pay the most expensive obligation first.",
    ],
    career: [
      "A decision you have been avoiding becomes easier after Wednesday. Prepare the one-page case before you present it.",
      "Your work is being watched by someone who can change your role. Deliver on the smaller promise first.",
    ],
    health: [
      "Energy is uneven this week. Build in two early nights and protect your mornings from noise.",
      "Stress shows up in the shoulders and the sleep. Treat both as a schedule problem, not a character problem.",
    ],
  },
  month: {
    love: [
      "This month asks you to define what you actually want from a relationship, not what you have accepted. Speak before the last week, when words feel heavier.",
      "A commitment can deepen this month if you stop testing and start planning. Small shared routines move you further than a grand gesture.",
    ],
    finance: [
      "A structural change — a salary revision, a property step or a repayment plan — is possible this month. Do the numbers before the emotion.",
      "Do not lend what you cannot forget. If money moves out, write down the terms; {ruler} protects clarity but not vagueness.",
    ],
    career: [
      "The month gives one real opportunity and several distractions. Recognise the difference by asking what you will still have in six months.",
      "A work situation that has been stuck starts to loosen in the second half. Be ready with evidence and patience.",
    ],
    health: [
      "Health responds to repetition this month, not intensity. One habit, every day, will carry the whole month.",
      "Digestion and sleep are the two places to invest. Reduce one daily processed item and keep a fixed bedtime.",
    ],
  },
};

export function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const pick = (arr, h, shift) => arr[(h >>> shift) % arr.length];

function replaced(text, meta) {
  return text.replace(/\{ruler\}/g, meta.ruler);
}

function dayKey(date, offset = 0) {
  return format(addDays(date, offset), "yyyy-MM-dd");
}

/** Localized sign name / date range for pickers. */
export const signName = (index, lang) => (lang === "hi" ? SIGN_HI[index].name : SIGN_META[index].sign);
export const signRange = (index, lang) => (lang === "hi" ? SIGN_HI[index].range : SIGN_META[index].range);

const EN_AREA_LABELS = { love: "Love", finance: "Finance", career: "Career", health: "Health" };
const EN_LUCKY_LABELS = {
  colour: "Lucky Colour",
  number: "Lucky Number",
  time: "Auspicious Time (IST)",
  mood: "Mood",
  ruler: "Ruling Planet",
  symbol: "Symbol",
  tarot: "Tarot Card",
  stone: "Lucky Stone",
};

export function horoscope(index, period = "today", anchor = new Date(), lang = "en") {
  const hi = lang === "hi";
  const base = SIGN_META[index];
  const meta = hi ? { ...base, ...SIGN_HI[index] } : base;
  const h = hash(`${base.sign}-${period}-${dayKey(anchor, period === "yesterday" ? -1 : period === "tomorrow" ? 1 : 0)}`);
  const kind = period === "week" ? "week" : period === "month" ? "month" : "daily";
  const areaKind = hi ? AREA_TEXT_HI[kind] : AREA_TEXT[kind];
  const labels = hi ? AREA_LABELS_HI : EN_AREA_LABELS;
  const luckyLabels = hi ? LUCKY_LABELS_HI : EN_LUCKY_LABELS;
  const colorNames = hi ? COLOR_HI : COLOR_NAMES;

  const area = (key, shift) => {
    const score = 32 + ((h >>> shift) % 63);
    const bank = areaKind[key];
    const chosen = pick(bank, h, shift + 3);
    const text = replaced(chosen, meta);
    return { key, label: labels[key], score, text, more: `${text} ${replaced(bank[(bank.indexOf(chosen) + 1) % bank.length], meta)}` };
  };

  const offset = period === "yesterday" ? -1 : period === "tomorrow" ? 1 : 0;
  const day = addDays(anchor, offset);
  let dateLabel;
  if (hi) {
    if (period === "week") {
      const end = endOfWeek(day, { weekStartsOn: 1 });
      dateLabel = `${format(startOfWeek(day, { weekStartsOn: 1 }), "d")} – ${end.getDate()} ${MONTHS_HI[end.getMonth()]} ${end.getFullYear()}`;
    } else if (period === "month") {
      const start = startOfMonth(day);
      dateLabel = `${MONTHS_HI[start.getMonth()]} ${start.getFullYear()}`;
    } else {
      dateLabel = `${DAYS_HI[day.getDay()]}, ${day.getDate()} ${MONTHS_HI[day.getMonth()]} ${day.getFullYear()}`;
    }
  } else if (period === "week") {
    dateLabel = `${format(startOfWeek(day, { weekStartsOn: 1 }), "d")} – ${format(endOfWeek(day, { weekStartsOn: 1 }), "d MMMM yyyy")}`;
  } else if (period === "month") {
    dateLabel = format(startOfMonth(day), "MMMM yyyy");
  } else {
    dateLabel = format(day, "EEEE, d MMMM yyyy");
  }

  const startHour = 5 + ((h >>> 11) % 17);
  const startMinute = (h >>> 5) % 60;
  const endHour = startHour + 1 + ((h >>> 9) % 2);
  const endMinute = (startMinute + 37) % 60;
  const clock = (hh, mm) => `${String(hh % 24).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;

  const enTitle = `${base.sign} Horoscope ${period === "week" ? "This Week" : period === "month" ? "This Month" : period === "tomorrow" ? "Tomorrow" : period === "yesterday" ? "Yesterday" : "Today"}`;

  return {
    title: hi ? `${meta.name} राशिफल — ${PERIOD_WORDS_HI[period] ?? PERIOD_WORDS_HI.daily}` : enTitle,
    range: hi ? meta.range : base.range,
    dateLabel,
    narrative: replaced(pick(hi ? NARRATIVE_HI[kind] : NARRATIVE[kind], h, 13), meta),
    areas: [area("love", 1), area("finance", 3), area("career", 5), area("health", 7)],
    lucky: [
      { label: luckyLabels.colour, value: `${colorNames[meta.colors[0]] ?? (hi ? "स्वर्ण" : "Gold")} & ${colorNames[meta.colors[1]] ?? (hi ? "हाथीदांत" : "Ivory")}`, swatches: meta.colors },
      { label: luckyLabels.number, value: String(base.number) },
      { label: luckyLabels.time, value: `${clock(startHour, startMinute)} – ${clock(endHour, endMinute)}` },
      { label: luckyLabels.mood, value: hi ? MOODS_HI[h % MOODS_HI.length] : MOODS[h % MOODS.length] },
      { label: luckyLabels.ruler, value: meta.ruler },
      { label: luckyLabels.symbol, value: meta.symbol, glyph: index },
      { label: luckyLabels.tarot, value: meta.tarot },
      { label: luckyLabels.stone, value: meta.stone },
    ],
  };
}