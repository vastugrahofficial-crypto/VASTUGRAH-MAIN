import React, { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

/** Desktop menu item whose sub-options unfold downward like a drawer on hover. */
export default function NavDropdown({ item }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  const show = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <Link
        to={item.to}
        className="btn-caps flex items-center gap-1 py-2 text-foreground/80 transition hover:text-primary"
        activeProps={{ className: "text-primary" }}
        activeOptions={{ exact: true }}
      >
        {item.label}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-50 -translate-x-1/2 overflow-hidden pt-3"
          >
            <ul className="w-[19rem] rounded-2xl border border-border bg-card py-2 shadow-[0_24px_60px_-30px_hsl(var(--foreground)/0.5)]">
              {item.children.map((c) => (
                <li key={c.key}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm text-foreground/80 transition hover:bg-secondary hover:text-primary"
                    >
                      <span>{c.label}</span>
                      <span aria-hidden="true" className="text-xs opacity-60">↗</span>
                    </a>
                  ) : (
                    <Link
                      to={c.to}
                      search={c.search}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm text-foreground/80 transition hover:bg-secondary hover:text-primary"
                    >
                      <span>{c.label}</span>
                      <span aria-hidden="true" className="text-xs opacity-60">→</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}