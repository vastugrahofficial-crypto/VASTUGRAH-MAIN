import React from "react";
import { ArrowUpRight } from "lucide-react";
import { serviceOf, waLink } from "@/lib/site";
import { useLang } from "@/lib/i18n";

export default function ServiceCard({ s }) {
  const { lang, t } = useLang();
  const item = serviceOf(s, lang);
  const Icon = item.icon;

  const inquiryText = `Namaste Vastugrah, I would like to inquire about ${item.title}.`;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg sm:p-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-12 sm:w-12">
            {Icon && <Icon className="h-5 w-5 sm:h-6 sm:w-6" />}
          </div>
          <span className="rounded-full bg-secondary/70 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase sm:text-xs">
            {item.group}
          </span>
        </div>
        <h3 className="mt-4 font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {item.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {item.desc}
        </p>
      </div>

      <div className="mt-5 border-t border-border/60 pt-3">
        <a
          href={waLink(inquiryText)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm"
        >
          {t("svc.consult") || (lang === "hi" ? "परामर्श लें" : "Book Consultation")}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
}

