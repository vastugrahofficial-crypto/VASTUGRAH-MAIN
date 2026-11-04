import React, { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useLang } from "@/lib/i18n";

const STATS = [
  { to: 4.9, dec: 1, suffix: "/5", labelKey: "stats.rating" },
  { to: 10, dec: 0, suffix: "K+", labelKey: "stats.followers" },
  { to: 5000, dec: 0, suffix: "+", labelKey: "stats.clients" },
  { to: 15, dec: 0, suffix: "+", labelKey: "stats.years" },
];

function Stat({ to, dec, suffix, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-2xl leading-none text-primary sm:text-3xl md:text-4xl">{v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</div>
      <div className="btn-caps mt-1.5 text-[0.58rem] text-muted-foreground sm:text-[0.66rem]">{label}</div>
    </div>
  );
}

export default function Stats() {
  const { t } = useLang();
  return (
    <section className="border-y border-border bg-card/70 py-7">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-4 gap-y-5 px-5 md:grid-cols-4">
        {STATS.map((s) => <Stat key={s.labelKey} {...s} label={t(s.labelKey)} />)}
      </div>
    </section>
  );
}