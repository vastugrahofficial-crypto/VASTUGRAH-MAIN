export const SPECIALISTS = [
  { id: "career", name: "Career", nameHi: "करियर", icon: "Briefcase", accent: "#B98A2E", focus: "job changes, promotions, timing of offers and workplace friction", focusHi: "नौकरी परिवर्तन, पदोन्नति, ऑफ़र का समय और कार्यस्थल की रुकावटें" },
  { id: "wealth", name: "Wealth", nameHi: "संपत्ति", icon: "TrendingUp", accent: "#3F7A5E", focus: "long-term wealth, savings, property and dhana yogas", focusHi: "दीर्घकालीन धन, बचत, संपत्ति और धन योग" },
  { id: "money", name: "Money", nameHi: "धन", icon: "Coins", accent: "#C09A3E", focus: "cash flow, debts, loans and month-to-month finances", focusHi: "नकदी प्रवाह, कर्ज़, ऋण और माह-दर-माह वित्त" },
  { id: "health", name: "Health", nameHi: "स्वास्थ्य", icon: "HeartPulse", accent: "#4A6C8C", focus: "constitution, energy cycles and periods that need care", focusHi: "प्रकृति, ऊर्जा चक्र और वे समय जिनमें विशेष ध्यान चाहिए" },
  { id: "love", name: "Love", nameHi: "प्रेम", icon: "Heart", accent: "#A8556B", focus: "romance, compatibility, break-ups and reconciliation", focusHi: "प्रेम, अनुकूलता, अलगाव और पुनर्मिलन" },
  { id: "marriage", name: "Marriage", nameHi: "विवाह", icon: "Gem", accent: "#8A5A8C", focus: "matching, marriage timing and post-marriage harmony", focusHi: "मिलान, विवाह का समय और विवाह के बाद सामंजस्य" },
  { id: "birth", name: "Birth Chart", nameHi: "जन्म कुंडली", icon: "ScrollText", accent: "#7A5A3A", focus: "reading the kundli, lagna, nakshatra, dasha and yogas", focusHi: "कुंडली, लग्न, नक्षत्र, दशा और योगों का पाठ" },
  { id: "business", name: "Business", nameHi: "व्यापार", icon: "Building2", accent: "#3F6F7A", focus: "partnerships, expansion, launch timing and business Vastu", focusHi: "साझेदारी, विस्तार, शुरुआत का समय और व्यापारिक वास्तु" },
  { id: "education", name: "Education", nameHi: "शिक्षा", icon: "GraduationCap", accent: "#5A6AA8", focus: "studies, exams, foreign education and career streams", focusHi: "पढ़ाई, परीक्षा, विदेश शिक्षा और करियर की दिशा" },
  { id: "vastu", name: "Vastu", nameHi: "वास्तु", icon: "Home", accent: "#A06A3A", focus: "rooms, directions, entrances and simple non-demolition remedies", focusHi: "कमरे, दिशाएँ, प्रवेश द्वार और सरल बिना-तोड़-फोड़ उपाय" },
];

export const specialistById = (id) => SPECIALISTS.find((s) => s.id === id) ?? SPECIALISTS[0];

export const specialistName = (s, lang) => (lang === "hi" ? s.nameHi : s.name);
export const specialistFocus = (s, lang) => (lang === "hi" ? s.focusHi : s.focus);

export function astrologerWaText(specialistNameValue, chart) {
  const who = chart?.name ? `${chart.name}` : "a visitor";
  const base = `Namaste Vastugrah, my ${specialistNameValue} AI astrologer suggested I speak to a human astrologer`;
  const details = chart
    ? `. My details — ${who}, born ${chart.date} at ${chart.time}, ${chart.place}. Lagna ${chart.lagna}, Rashi ${chart.rashi}, Nakshatra ${chart.nakshatra}.`
    : ".";
  return `${base}${details}`;
}