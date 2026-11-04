import React from "react";
import Reveal from "@/components/site/Reveal";

export default function SectionTitle({ eyebrow, title, sub }) {
  return (
    <Reveal className="mx-auto mb-7 max-w-2xl text-center">
      <p className="btn-caps mb-2 text-primary">{eyebrow}</p>
      <h2 className="text-[1.9rem] leading-tight md:text-5xl">{title}</h2>
      <div className="mx-auto my-3.5 h-px w-20 bg-primary" />
      {sub && <p className="text-sm text-muted-foreground sm:text-base">{sub}</p>}
    </Reveal>
  );
}