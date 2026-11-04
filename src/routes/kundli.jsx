import React, { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SectionTitle from "@/components/site/SectionTitle";
import KundliForm from "@/components/kundli/KundliForm";
import KundliResult from "@/components/kundli/KundliResult";
import KundliLoading from "@/components/kundli/KundliLoading";
import { saveChart } from "@/lib/kundli/storage";

export const Route = createFileRoute("/kundli")({
  head: () => ({
    meta: [
      { title: "Free Kundli | Vastugrah" },
      { name: "description", content: "Generate your free Janma Kundli with Lagna, Chandra, Navamsa and Dashamsa charts, planetary positions, panchang, dasha and a downloadable PDF report." },
    ],
  }),
  component: FreeKundli,
});

function FreeKundli() {
  const [kundli, setKundli] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const resultRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (kundli && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [kundli]);

  const handleKundli = (next) => {
    setKundli(null);
    setCalculating(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveChart(next);
      setKundli(next);
      setCalculating(false);
    }, 2400);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionTitle
        eyebrow="Free Janma Kundli"
        title="Get Your Kundli, Free"
        sub="Enter your birth details to see all your charts, planetary positions and dasha, and download the report as a PDF."
      />
      <KundliForm onSubmit={handleKundli} />

      <div ref={resultRef}>
        {calculating && <KundliLoading />}
        {kundli && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <KundliResult kundli={kundli} />
          </motion.div>
        )}
      </div>
    </div>
  );
}