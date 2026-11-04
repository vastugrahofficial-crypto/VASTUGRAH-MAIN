import React, { useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { CITIES } from "@/lib/kundli/cities";
import { useLang } from "@/lib/i18n";

/**
 * Searchable birth-place picker. The result list sits *below* the input in normal
 * flow, so it never covers what the visitor is typing.
 */
export default function PlaceCombobox({ value, onChange }) {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const selected = value === "manual" ? null : CITIES[Number(value)];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CITIES.slice(0, 30);
    return CITIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 30);
  }, [query]);

  const pick = (index) => {
    onChange(String(index));
    setQuery("");
    setOpen(false);
  };

  return (
    <div>
      <div className="relative mt-2">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          value={open ? query : selected?.name ?? query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("kform.searchPh")}
          className="h-12 w-full rounded-full border border-border bg-background pl-9 pr-4 text-base outline-none transition focus:border-primary"
        />
      </div>

      {open && (
        <div className="mt-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
          <div className="max-h-60 overflow-y-auto">
            {results.map((c) => {
              const index = CITIES.indexOf(c);
              const active = index === Number(value);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => pick(index)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                    active ? "bg-primary/12 text-primary" : "text-foreground/85 hover:bg-secondary"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
            {!results.length && <p className="px-3 py-2 text-sm text-muted-foreground">{t("kform.noMatch")}</p>}
          </div>
          <button
            type="button"
            onClick={() => pick("manual")}
            className={`mt-1 w-full rounded-xl px-3 py-2 text-left text-sm transition ${
              value === "manual" ? "bg-primary/12 text-primary" : "text-foreground/80 hover:bg-secondary"
            }`}
          >
            {t("kform.manual")}
          </button>
        </div>
      )}
    </div>
  );
}