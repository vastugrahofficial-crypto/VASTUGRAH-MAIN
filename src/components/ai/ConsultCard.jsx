import React from "react";
import { MessageCircle } from "lucide-react";
import { astrologerWaText } from "@/lib/aiAstrologers";
import { waLink } from "@/lib/site";
import { useLang } from "@/lib/i18n";

export default function ConsultCard({ specialist, chart }) {
  const { t } = useLang();

  return (
    <div className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-secondary/50 p-5">
      <div>
        <p className="btn-caps text-primary">{t("ai.needHuman")}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("ai.needHumanBody")}</p>
        <ul className="mt-4 space-y-2 text-sm">
          {[t("ai.p1"), t("ai.p2"), t("ai.p3")].map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-foreground/80">{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <a
        href={waLink(astrologerWaText(specialist.name, chart))}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-caps mt-1 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full border border-primary px-5 text-primary transition hover:bg-primary hover:text-primary-foreground"
      >
        <MessageCircle size={16} /> {t("ai.talkHuman")}
      </a>
    </div>
  );
}