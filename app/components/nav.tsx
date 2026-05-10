"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#work", label: "Work", code: "01" },
  { href: "#services", label: "Services", code: "02" },
  { href: "#pricing", label: "Pricing", code: "03" },
  { href: "#coverage", label: "Coverage", code: "04" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when mobile menu open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Bottom-sheet drag-to-dismiss on touch
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragStart.current == null || !sheetRef.current) return;
    const dy = e.touches[0].clientY - dragStart.current;
    if (dy > 0) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (dragStart.current == null || !sheetRef.current) return;
    const dy = e.changedTouches[0].clientY - dragStart.current;
    sheetRef.current.style.transform = "";
    dragStart.current = null;
    if (dy > 80) setOpen(false);
  };

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 " +
        (scrolled
          ? "bg-ink/80 backdrop-blur-md border-b border-frame"
          : "bg-transparent")
      }
    >
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 md:h-16 md:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2 text-paper"
          aria-label="Bondarenko Home Photography — back to top"
        >
          <span
            aria-hidden
            className="size-[7px] rounded-full bg-magenta"
            style={{ boxShadow: "0 0 10px var(--color-magenta)" }}
          />
          <span className="font-display text-[1.05rem] tracking-tight md:text-[1.15rem]">
            Bondarenko<span className="text-mist"> Home</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-eyebrow-sm text-mist transition-colors hover:text-paper"
            >
              <span className="text-frame-strong group-hover:text-magenta transition-colors">
                {l.code}
              </span>
              <span className="ml-2">{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#book"
            className="hidden rounded-full border border-paper bg-paper px-4 py-2 text-eyebrow-sm text-ink transition-colors hover:bg-magenta hover:border-magenta hover:text-paper md:inline-flex md:items-center md:gap-2"
          >
            BOOK A SHOOT
            <Arrow />
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="grid size-11 place-items-center rounded-full border border-frame bg-graphite/40 text-paper md:hidden"
          >
            <span className="grid gap-[5px]">
              <span
                className={
                  "block h-[1.5px] w-[18px] bg-paper transition-transform " +
                  (open ? "translate-y-[3px] rotate-45" : "")
                }
              />
              <span
                className={
                  "block h-[1.5px] w-[18px] bg-paper transition-transform " +
                  (open ? "-translate-y-[3px] -rotate-45" : "")
                }
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile bottom sheet — scrim + sheet, content-driven height */}
      <div
        className={
          "fixed inset-0 z-40 transition-opacity duration-300 md:hidden " +
          (open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")
        }
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      >
        {/* Scrim */}
        <div className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]" />

        {/* Sheet */}
        <div
          ref={sheetRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={
            "absolute inset-x-0 bottom-0 rounded-t-[20px] border-t border-frame-strong bg-graphite/95 backdrop-blur-md shadow-[0_-12px_40px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out " +
            (open ? "translate-y-0" : "translate-y-full")
          }
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <span aria-hidden className="block h-1 w-10 rounded-full bg-frame-strong" />
          </div>

          <div className="flex flex-col gap-6 px-6 pt-3 pb-2">
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline justify-between border-b border-frame py-4"
                  >
                    <span className="display-3 text-paper">{l.label}</span>
                    <span className="text-eyebrow-sm text-mist">{l.code}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-between rounded-full border border-paper bg-paper px-5 py-4 text-eyebrow text-ink"
            >
              BOOK A SHOOT
              <Arrow />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
