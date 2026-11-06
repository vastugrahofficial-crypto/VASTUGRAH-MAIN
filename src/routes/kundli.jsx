import React, { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SectionTitle from "@/components/site/SectionTitle";
import KundliForm from "@/components/kundli/KundliForm";
import KundliResult from "@/components/kundli/KundliResult";
import KundliLoading from "@/components/kundli/KundliLoading";
import { saveChart } from "@/lib/kundli/storage";
import { computeKundli } from "@/lib/kundli/kundli";
import { computeKundliViaApi } from "@/lib/kundli/apiKundli";

export const Route = createFileRoute("/kundli")({
  head: () => ({
    meta: [
      { title: "Free Kundli | Vastugrah" },
      { name: "description", content: "Generate your free Janma Kundli with Lagna, Chandra, Navamsa and Dashamsa charts, planetary positions, panchang, dasha and a downloadable PDF report." },
    ],
  }),
  component: FreeKundli,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function FreeKundli() {
  const [kundli, setKundli] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [apiError, setApiError] = useState("");
  const [debug, setDebug] = useState(false);
  const resultRef = useRef(null);
  const runId = useRef(0);

  // Ignore results that arrive after the page was closed
  useEffect(() => () => { runId.current = -1; }, []);

  // Open /kundli?debug=1 to see whether the API or the in-app calculation was used
  useEffect(() => {
    setDebug(new URLSearchParams(window.location.search).has("debug"));
  }, []);

  useEffect(() => {
    if (kundli && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [kundli]);

  const handleKundli = async (input) => {
    const id = ++runId.current;
    setKundli(null);
    setApiError("");
    setCalculating(true);

    const minDelay = sleep(2400); // keeps the loading animation

    let next;
    try {
      // 1) Calculated by the astrology API
      next = await computeKundliViaApi(input);
      console.info("[Kundli] calculated by the astrology API");
    } catch (err) {
      // 2) API unavailable / limit reached / unexpected response: use the in-app calculation
      console.warn("[Kundli] API failed, using in-app calculation:", err?.message || err);
      setApiError(String(err?.message || err));
      next = computeKundli(input);
    }

    await minDelay;
    if (id !== runId.current) return;

    saveChart(next);
    setKundli(next);
    setCalculating(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionTitle
        eyebrow="Free Janma Kundli"
        title="Get Your Kundli, Free"
        sub="Enter your birth details to see all your charts, planetary positions and dasha, and download the report as a PDF."
      />
      <KundliForm onSubmit={handleKundli} busy={calculating} />

      <div ref={resultRef}>
        {calculating && <KundliLoading />}
        {debug && kundli && (
          <p className="mt-4 rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            Calculation source: <b>{kundli.source === "api" ? "Astrology API" : "In-app (API not used)"}</b>
            {apiError ? ` — reason: ${apiError}` : ""}
          </p>
        )}
        {kundli && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <KundliResult kundli={kundli} />
          </motion.div>
        )}
      </div>
    </div>
  );
}