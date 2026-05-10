"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  type Category,
  type Frame,
  categoryList,
  frames,
  frameSrc,
} from "@/data/portfolio";
import GalleryCard from "./gallery-card";
import ScrambleText from "./fx/scramble-text";

type Filter = "ALL" | Category;

const filters: Filter[] = ["ALL", ...categoryList];

const MOBILE_INITIAL = 6;

export default function Gallery() {
  const [active, setActive] = useState<Filter>("ALL");
  const [open, setOpen] = useState<Frame | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

  const filtered = useMemo(
    () => (active === "ALL" ? frames : frames.filter((f) => f.category === active)),
    [active]
  );

  // Reset mobile pagination whenever filter changes.
  const setActiveAndReset = (f: Filter) => {
    setActive(f);
    setShowAllMobile(false);
  };

  // Track whether viewport is mobile so we slice the data, not just hide.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const visible =
    isMobile && !showAllMobile ? filtered.slice(0, MOBILE_INITIAL) : filtered;
  const hiddenCount = isMobile && !showAllMobile ? filtered.length - visible.length : 0;

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section
      id="work"
      aria-label="Portfolio"
      className="relative overflow-hidden bg-ink"
    >
      <div className="mx-auto max-w-[1600px] px-4 pt-24 md:px-8 md:pt-32">
        {/* Section header */}
        <div className="grid gap-8 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <div className="text-eyebrow text-magenta">
              <ScrambleText text=">> THE WORK" />
            </div>
            <p className="mt-3 text-eyebrow-sm text-mist">
              25 RECENT FRAMES · 5 CATEGORIES
            </p>
          </div>

          <div className="md:col-span-9">
            <h2 className="display-2 max-w-[18ch]">
              <span className="text-paper">A street</span>{" "}
              <span className="text-mist">of homes,</span>{" "}
              <em className="not-italic [font-style:italic] text-paper">
                lit on purpose.
              </em>
            </h2>
          </div>
        </div>

        {/* Filter pills */}
        <div className="mt-10 -mx-4 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:px-0 md:mt-12">
          <div className="flex w-max gap-2 md:flex-wrap md:w-auto">
            {filters.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveAndReset(f)}
                  data-cursor="frame"
                  className={
                    "group relative inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-eyebrow-sm transition-colors sm:min-h-0 sm:px-3.5 " +
                    (isActive
                      ? "border-paper bg-paper text-ink"
                      : "border-frame text-mist hover:text-paper hover:border-frame-strong")
                  }
                >
                  <span
                    aria-hidden
                    className={
                      "block size-[6px] rounded-full transition-colors " +
                      (isActive ? "bg-magenta" : "bg-frame-strong")
                    }
                  />
                  {f}
                  <span
                    className={
                      "tabular-nums " +
                      (isActive ? "text-ink/55" : "text-frame-strong")
                    }
                  >
                    {f === "ALL"
                      ? frames.length
                      : frames.filter((x) => x.category === f).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-12 md:gap-8 md:auto-rows-[14vh]">
          <AnimatePresence mode="popLayout">
            {visible.map((f, i) => (
              <GalleryCard
                key={f.id}
                frame={f}
                index={i}
                total={filtered.length}
                onOpen={setOpen}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile-only: progressive disclosure of the long tail */}
        {hiddenCount > 0 && (
          <div className="mt-8 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAllMobile(true)}
              className="inline-flex items-center gap-2 rounded-full border border-frame-strong bg-graphite/40 px-5 py-3 text-eyebrow text-paper transition-colors hover:bg-graphite/80"
            >
              VIEW ALL {filtered.length} FRAMES
              <span aria-hidden>↓</span>
            </button>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-frame pt-8 md:mt-24">
          <p className="text-eyebrow-sm text-mist">
            ▶ EVERY FRAME EDITED BY HAND · NO STOCK · NO AI COMPOSITES
          </p>
          <a
            href="#book"
            data-cursor="frame"
            className="inline-flex min-h-11 items-center gap-2 py-2 text-eyebrow text-paper transition-colors hover:text-magenta sm:min-h-0 sm:py-0"
          >
            BOOK YOUR LISTING
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex flex-col bg-ink/95 backdrop-blur-md"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${open.title} — ${open.location}`}
          >
            <div className="flex items-center justify-between border-b border-frame px-4 py-3 md:px-8">
              <div className="text-eyebrow-sm text-mist tabular-nums">
                <span className="text-magenta">▶</span> {open.category} · {open.location}
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setOpen(null); }}
                className="grid size-9 place-items-center rounded-full border border-frame text-paper hover:bg-graphite"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
            <div
              className="relative flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={frameSrc(open, 2400)}
                alt={open.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="grid gap-2 border-t border-frame px-4 py-4 text-eyebrow-sm tabular-nums md:flex md:items-center md:justify-between md:px-8">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-mist">
                <span>FRAME · <span className="text-paper">{open.title}</span></span>
                <span>LIGHT · <span className="text-paper">{open.light}</span></span>
                <span>LENS · <span className="text-paper">{open.lens}</span></span>
              </div>
              <div className="text-haze">CLICK ANYWHERE OR PRESS ESC TO CLOSE</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
