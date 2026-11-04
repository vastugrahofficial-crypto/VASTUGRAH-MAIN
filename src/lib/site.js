import { Compass, Gem, ScrollText, House, Building2, Factory, Heart, Sparkles, Flame } from "lucide-react";

export const BRAND = "Vastugrah";
export const PHONE_DISPLAY = "+91 9311001071";
export const PHONE_TEL = "+919311001071";
export const WA_NUMBER = "919311001071";
export const EMAIL = "vastugrahofficial@gmail.com";
export const ADDRESS = "Faridabad, Haryana - INDIA";
export const LOGO = "/logo.png";
export const SOCIALS = {
  instagram: "https://www.instagram.com/vastugrah",
  facebook: "https://www.facebook.com/vastugrah",
  youtube: "https://www.youtube.com/@vastugrahofficial",
};

export const waLink = (text = "Namaste Vastugrah, I would like to know more about your services.") =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/horoscope", label: "Horoscope" },
  { to: "/kundli", label: "Free Kundli" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const SERVICES = [
  { icon: House, group: "Residential", groupHi: "आवासीय", title: "Residential Vastu", titleHi: "आवासीय वास्तु", desc: "Room-by-room energy alignment for homes, flats and villas, with simple, non-demolition remedies.", descHi: "घर, फ्लैट और विला के लिए कमरा-दर-कमरा ऊर्जा संतुलन, बिना तोड़-फोड़ के सरल उपाय।" },
  { icon: Building2, group: "Commercial", groupHi: "वाणिज्यिक", title: "Commercial Vastu", titleHi: "वाणिज्यिक वास्तु", desc: "Shop, office and showroom layouts arranged for steady growth, cash-flow and client attraction.", descHi: "दुकान, कार्यालय और शोरूम की योजना — निरंतर वृद्धि, नकदी प्रवाह और ग्राहक आकर्षण के लिए।" },
  { icon: Factory, group: "Industrial", groupHi: "औद्योगिक", title: "Industrial Vastu", titleHi: "औद्योगिक वास्तु", desc: "Plant, warehouse and factory planning guided by the five elements for productivity and stability.", descHi: "प्लांट, गोदाम और फैक्ट्री की योजना पंचतत्वों के अनुसार — उत्पादकता और स्थिरता के लिए।" },
  { icon: ScrollText, group: "Astrology", groupHi: "ज्योतिष", title: "Premium Kundli Reading", titleHi: "प्रीमियम कुंडली पाठ", desc: "A detailed Vedic birth-chart report covering career, wealth, marriage, health and dasha timelines.", descHi: "विस्तृत वैदिक जन्म-कुंडली रिपोर्ट — करियर, धन, विवाह, स्वास्थ्य और दशा समय-रेखा के साथ।" },
  { icon: Sparkles, group: "Astrology", groupHi: "ज्योतिष", title: "Varshphal Report", titleHi: "वर्षफल रिपोर्ट", desc: "Your 12-month forecast, with the best months for decisions, travel, investment and change.", descHi: "आपके बारह महीनों का पूर्वानुमान — निर्णय, यात्रा, निवेश और बदलाव के लिए श्रेष्ठ महीने।" },
  { icon: Heart, group: "Astrology", groupHi: "ज्योतिष", title: "Love & Marriage Matching", titleHi: "प्रेम एवं विवाह मिलान", desc: "Kundli matching, compatibility insights and timing guidance for relationships.", descHi: "कुंडली मिलान, अनुकूलता और संबंधों के लिए शुभ समय का मार्गदर्शन।" },
  { icon: Gem, group: "Gemology", groupHi: "रत्न विज्ञान", title: "Gemstone Consultation", titleHi: "रत्न परामर्श", desc: "Certified gemstone recommendations matched to your chart, with wearing method and muhurat.", descHi: "आपकी कुंडली के अनुसार प्रमाणित रत्न, धारण विधि और मुहूर्त के साथ।" },
  { icon: Flame, group: "Puja", groupHi: "पूजा", title: "Puja & Anushthan", titleHi: "पूजा एवं अनुष्ठान", desc: "Authentic Vedic rituals performed for prosperity, peace and planetary balance.", descHi: "समृद्धि, शांति और ग्रह संतुलन के लिए प्रामाणिक वैदिक अनुष्ठान।" },
  { icon: Compass, group: "Consultation", groupHi: "परामर्श", title: "One-on-One Consultation", titleHi: "व्यक्तिगत परामर्श", desc: "Speak directly with an experienced astrologer on call or WhatsApp for decisions that cannot wait.", descHi: "जिन निर्णयों को टाला नहीं जा सकता, उनके लिए कॉल या व्हाट्सएप पर अनुभवी ज्योतिषी से सीधे बात करें।" },
];

/** Localized view of a service entry. */
export const serviceOf = (s, lang) =>
  lang === "hi" ? { ...s, group: s.groupHi, title: s.titleHi, desc: s.descHi } : s;

export const FEATURED = [
  { title: "Vastu Audit", titleHi: "वास्तु ऑडिट", desc: "Compass-accurate analysis of your space.", descHi: "आपके स्थान का दिशा-सटीक विश्लेषण।", img: "/images/vastu-audit.png" },
  { title: "Gemology", titleHi: "रत्न विज्ञान", desc: "Stones chosen by your planetary needs.", descHi: "आपके ग्रहों की आवश्यकता से चुने गए रत्न।", img: "/images/gemology.png" },
  { title: "Astrology", titleHi: "ज्योतिष", desc: "Kundli reading with real clarity.", descHi: "वास्तविक स्पष्टता के साथ कुंडली पाठ।", img: "/images/astrology.png" },
];

export const TESTIMONIALS = [
  { name: "Rohit Sharma", city: "Gurugram", text: "After the Vastu corrections in our new office, enquiries picked up within weeks. Clear, practical advice with no unnecessary changes.", textHi: "नए कार्यालय में वास्तु सुधार के कुछ ही सप्ताह में पूछताछ बढ़ गई। स्पष्ट और व्यावहारिक सलाह, बिना अनावश्यक बदलाव के।" },
  { name: "Neha Gupta", city: "Faridabad", text: "The Kundli report was remarkably detailed and the follow-up call answered every doubt about my career. Highly recommended.", textHi: "कुंडली रिपोर्ट बेहद विस्तृत थी और अगली कॉल में करियर से जुड़ी हर शंका का उत्तर मिला। अत्यंत अनुशंसित।" },
  { name: "Anil Verma", city: "Delhi", text: "Simple remedies for our home, explained patiently. The peace in the house is something we felt immediately.", textHi: "घर के लिए सरल उपाय, धैर्य से समझाए गए। घर में जो शांति आई, वह तुरंत अनुभव हुई।" },
];

export const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
export const SIGN_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
