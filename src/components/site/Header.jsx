import React from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import BrandLogo from "@/components/site/BrandLogo";
import NavDrawer from "@/components/site/NavDrawer";
import NavDropdown from "@/components/site/NavDropdown";
import ThemeToggle from "@/components/site/ThemeToggle";
import LangToggle from "@/components/site/LangToggle";
import WaButton from "@/components/site/WaButton";
import { buildNav } from "@/lib/navMenu";
import { useLang } from "@/lib/i18n";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { t, lang } = useLang();
  const items = buildNav(t, lang);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 xl:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Vastugrah home">
          <BrandLogo className="h-12 w-12" px={192} />
          <span className="font-heading text-[1.15rem] leading-none tracking-[0.2em] sm:text-2xl">VASTUGRAH</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex xl:gap-10">
          {items.map((n) =>
            n.children ? (
              <NavDropdown key={n.to} item={n} />
            ) : (
              <Link
                key={n.to}
                to={n.to}
                className="btn-caps whitespace-nowrap py-2 text-foreground/80 transition hover:text-primary"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <WaButton className="hidden md:inline-flex" text="Namaste Vastugrah, I want to book a consultation.">
            {t("common.bookNow")}
          </WaButton>
          <LangToggle />
          <ThemeToggle />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground/80 transition hover:border-primary hover:text-primary"
            aria-label={t("common.menu")}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      <NavDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}