import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ScrollText, Sparkles } from "lucide-react";
import SpecialistGrid from "@/components/ai/SpecialistGrid";
import AiChat from "@/components/ai/AiChat";
import ConsultCard from "@/components/ai/ConsultCard";
import Avatar from "@/components/ai/Avatar";
import { askAstrologer } from "@/lib/server-fns";
import { readChart } from "@/lib/kundli/storage";
import { specialistById, specialistFocus, specialistName } from "@/lib/aiAstrologers";
import { useAuth } from "@/lib/AuthContext";
import { useLang } from "@/lib/i18n";

const chartText = (c) =>
  c ? `${c.name}, born ${c.date} at ${c.time} in ${c.place}; Lagna ${c.lagna}, Rashi ${c.rashi}, Nakshatra ${c.nakshatra}, current dasha ${c.dasha}` : undefined;

export default function AiAstrologerWindow({ initialId }) {
  const { user } = useAuth();
  const { t, tf, lang } = useLang();
  const [activeId, setActiveId] = useState(specialistById(initialId).id);
  const [threads, setThreads] = useState({});
  const [busy, setBusy] = useState(false);
  const [chart, setChart] = useState(null);
  const ask = useServerFn(askAstrologer);

  useEffect(() => setChart(readChart()), []);

  useEffect(() => {
    if (initialId) setActiveId(specialistById(initialId).id);
  }, [initialId]);

  const fullName = chart?.name || user?.full_name || "";
  const firstName = fullName.trim().split(/\s+/)[0] || "";
  const photo = user?.avatar_url || user?.profile_image || user?.image || "";

  const specialist = specialistById(activeId);
  const focus = specialistFocus(specialist, lang);

  const greeting = chart
    ? tf("ai.greetChart", { name: firstName ? ` ${firstName}` : "", focus, lagna: chart.lagna, rashi: chart.rashi, nakshatra: chart.nakshatra, dasha: chart.dasha })
    : tf("ai.greetNoChart", { name: firstName ? ` ${firstName}` : "", focus });

  const messages = threads[activeId] ?? [{ role: "assistant", content: greeting }];

  const send = async (text) => {
    const next = [...messages, { role: "user", content: text }];
    setThreads((th) => ({ ...th, [activeId]: next }));
    setBusy(true);
    try {
      const res = await ask({
        data: {
          specialist: activeId,
          chart: chartText(chart),
          name: firstName || undefined,
          lang,
          messages: next.slice(-8),
        },
      });
      setThreads((th) => ({ ...th, [activeId]: [...next, { role: "assistant", content: res.reply }] }));
    } catch {
      setThreads((th) => ({
        ...th,
        [activeId]: [
          ...next,
          {
            role: "assistant",
            content:
              lang === "hi"
                ? "ग्रहों के गोचर का अध्ययन करते समय क्षणिक विलंब हुआ। कृपया अपना प्रश्न पुनः पूछें, अथवा जन्म कुंडली विवरण साझा करें ताकि विस्तृत विश्लेषण किया जा सके।"
                : "I encountered a brief pause while reviewing the planetary alignments. Please ask your question once more, or share your birth details for an exact reading.",
          },
        ],
      }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 text-center">
        <p className="btn-caps text-primary">{t("ai.eyebrow")}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{t("ai.title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("ai.sub")}</p>
      </div>

      <div className="soft-panel rounded-3xl border border-border p-3 sm:p-5">
        <SpecialistGrid activeId={activeId} onPick={setActiveId} />

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-border bg-background/80">
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Sparkles size={16} />
              </span>
              <div className="min-w-0">
                <p className="font-heading text-lg leading-none">{specialistName(specialist, lang)} {lang === "hi" ? "ज्योतिषी" : "AI Astrologer"}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{focus}</p>
              </div>
              <div className="ml-auto shrink-0">
                <Avatar name={fullName || t("ai.you")} src={photo} className="h-9 w-9 text-[11px]" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-4 py-2 text-xs text-muted-foreground">
              <span>
                {t("ai.readingFor")} <span className="text-foreground">{firstName || t("ai.you")}</span>
              </span>
              {chart ? (
                <span className="chip text-[11px] text-primary">
                  <ScrollText size={12} /> {t("ai.chartLinked")} · {chart.rashi}
                </span>
              ) : (
                <Link to="/kundli" className="chip text-[11px]">
                  <ScrollText size={12} /> {t("ai.getChart")}
                </Link>
              )}
            </div>

            <AiChat
              specialist={specialist}
              messages={messages}
              busy={busy}
              onSend={send}
              user={{ name: fullName || t("ai.you"), image: photo }}
            />
          </div>

          <ConsultCard specialist={specialist} chart={chart} />
        </div>
      </div>
    </div>
  );
}
