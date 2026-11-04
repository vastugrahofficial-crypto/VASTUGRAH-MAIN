import React, { useState } from "react";
import SectionTitle from "@/components/site/SectionTitle";
import AstrologerCard from "./AstrologerCard";
import AstrologerArc from "./AstrologerArc";
import { ASTROLOGERS } from "@/lib/astrologers";
import { useLang } from "@/lib/i18n";

export default function Astrologers() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle
          eyebrow={lang === "hi" ? "हमारे आचार्य" : "Our Astrologers"}
          title={lang === "hi" ? "अनुभवी वैदिक ज्योतिषी" : "Senior Vedic Astrologers"}
          sub={
            lang === "hi"
              ? "प्रत्येक आचार्य का अपना विशिष्ट क्षेत्र और दशकों का प्रामाणिक अनुभव है।"
              : "Decades of classical Jyotish, Vastu and gemstone guidance from seasoned Acharyas."
          }
        />
        <div className="mt-10 flex flex-col items-center">
          <AstrologerCard a={ASTROLOGERS[active]} lang={lang} consult={lang === "hi" ? "परामर्श लें" : "Consult Now"} />
          <div className="mt-8 w-full max-w-2xl">
            <AstrologerArc active={active} onChange={setActive} />
          </div>
        </div>
      </div>
    </section>
  );
}

