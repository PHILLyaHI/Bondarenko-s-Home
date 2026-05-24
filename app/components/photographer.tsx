"use client";

/**
 * Photographer — editorial portrait section. Houses Ben's portrait, the
 * signature pull-quote, and the 1,200+ / 32% / 8-YR stat block.
 *
 * Two registers, one component:
 *  - Mobile: production-still stack — portrait → quote → trusted-by intro
 *    → stat row → CTAs. Brokerage names live in the TrustStrip marquee.
 *  - Desktop: magazine spread — 5-col portrait left, 7-col editorial copy
 *    right, with the italic Fraunces pull-quote dominating the right column
 *    and a horizontal stat row below.
 */

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

const stats = [
  { num: "1,200+", label: "LISTINGS PHOTOGRAPHED" },
  { num: "32%",    label: "FASTER AVERAGE SALES" },
  { num: "8 YR",   label: "ACROSS THE PUGET SOUND" },
];

const brokerages = [
  "Windermere", "Compass", "John L. Scott", "Redfin",
  "Coldwell Banker", "Keller Williams", "RE/MAX", "Sotheby's",
];

// Unsplash portrait — male photographer, window-lit, editorial.
const PORTRAIT =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1600";

export default function Photographer() {
  return (
    <section
      aria-label="The photographer"
      className="relative overflow-hidden bg-ink"
    >
      {/* Soft sage wash — anchored to the top so the section sits on a hint of light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%] -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 35% 25%, rgba(123,165,144,0.16) 0%, rgba(123,165,144,0.04) 50%, transparent 80%)",
        }}
      />
      {/* Desktop-only thin grid pattern as faint atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-[0.4] md:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "112px 100%",
        }}
      />

      {/* ─── MOBILE LAYOUT ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-16 md:hidden">
        {/* Eyebrow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger(0.06, 0.05)}
          className="flex items-baseline justify-between"
        >
          <motion.div variants={fadeUp} className="text-eyebrow text-sage">
            <ScrambleText text=">> THE PHOTOGRAPHER" />
          </motion.div>
          <motion.div variants={fadeUp} className="text-eyebrow-sm tabular-nums text-mist">
            EST 2018 · SEATTLE
          </motion.div>
        </motion.div>

        {/* Portrait frame */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative mt-8 overflow-hidden rounded-[2px] border border-frame"
        >
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={PORTRAIT}
              alt="Ben Bondarenko, photographer, looking out a window in soft side-light."
              fill
              sizes="100vw"
              className="object-cover object-[55%_25%]"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(28,31,29,0.45) 0%, rgba(28,31,29,0.05) 22%, rgba(28,31,29,0.10) 60%, rgba(28,31,29,0.88) 100%)",
              }}
            />
            <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-[2px] border border-paper/35 bg-ink/55 px-2 py-1 text-[0.58rem] tracking-[0.2em] uppercase text-paper backdrop-blur">
              <span aria-hidden className="block size-[5px] rounded-full bg-sage" />
              PORTRAIT · 01
            </div>
            <div className="absolute right-3 top-3 rounded-[2px] border border-frame bg-ink/45 px-2 py-1 text-[0.58rem] tracking-[0.2em] uppercase tabular-nums text-paper/85 backdrop-blur">
              47.6° N · 122.3° W
            </div>
            <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
              <div className="leading-tight">
                <div className="font-display text-[1.45rem] text-paper">
                  <em className="not-italic [font-style:italic]">Ben</em> Bondarenko
                </div>
                <div className="mt-1 text-[0.58rem] tracking-[0.22em] uppercase text-haze">
                  Lead photographer · Director of light
                </div>
              </div>
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full border border-paper/45 bg-ink/55 backdrop-blur"
              >
                <CameraGlyph />
              </span>
            </div>
          </div>
        </motion.figure>

        {/* Pull quote — " sits on the same row as the text, overlapping the
            first word from above-left so it reads as a typographic flourish
            rather than a separate decorative element. */}
        <motion.blockquote
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger(0.07, 0.05)}
          className="relative mt-10"
        >
          <motion.span
            variants={fadeUp}
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-5 font-display text-[4.5rem] leading-none text-sage"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60' }}
          >
            &ldquo;
          </motion.span>
          <motion.p
            variants={fadeUp}
            className="relative font-display text-[2rem] leading-[1.06] tracking-[-0.018em] text-paper"
            style={{ fontVariationSettings: '"opsz" 96, "SOFT" 35' }}
          >
            <em className="not-italic [font-style:italic]">Buyers scroll.</em>{" "}
            <span className="text-mist">Yours should be the one</span>{" "}
            <em className="not-italic [font-style:italic]">they slow down for.</em>
          </motion.p>
          <motion.figcaption
            variants={fadeUp}
            className="mt-5 flex items-center gap-3 text-[0.62rem] tracking-[0.22em] uppercase text-mist"
          >
            <span aria-hidden className="h-px w-7 bg-frame-strong" />
            Ben Bondarenko
          </motion.figcaption>
        </motion.blockquote>

        {/* Trusted-by intro + stat row.
            Stats laid out as a clean three-column inline row with hairline
            separators — same vocabulary as desktop, scaled for phone. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger(0.07, 0.05)}
          className="mt-10 border-t border-frame pt-7"
        >
          <motion.div variants={fadeUp} className="text-eyebrow text-mist">
            <span className="text-sage">▶</span> TRUSTED&nbsp;BY
          </motion.div>
          <motion.p variants={fadeUp} className="mt-3 max-w-[28ch] text-sm text-haze">
            Listing agents at the Sound's top brokerages.
          </motion.p>

          <motion.dl
            variants={fadeUp}
            className="mt-7 grid grid-cols-3"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={
                  "flex flex-col gap-2 " +
                  (i > 0 ? "border-l border-frame pl-3" : "pr-3")
                }
              >
                <dt className="font-display text-[1.55rem] leading-none text-paper tabular-nums">
                  {s.num}
                </dt>
                <dd className="font-mono text-[0.55rem] tracking-[0.18em] uppercase text-mist leading-snug">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-nowrap items-center gap-2">
            <a
              href="#work"
              data-cursor="frame"
              className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-frame-strong bg-ink/60 px-3 py-3.5 text-[0.62rem] tracking-[0.18em] uppercase text-paper transition-colors hover:bg-graphite"
            >
              SEE THE WORK
              <span aria-hidden>→</span>
            </a>
            <a
              href="#book"
              data-cursor="frame"
              className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-paper px-3 py-3.5 text-[0.62rem] tracking-[0.18em] uppercase text-ink transition-colors hover:bg-sage hover:text-paper"
            >
              BOOK A SHOOT
              <span aria-hidden>→</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── DESKTOP LAYOUT (md+) ───────────────────────────────────────── */}
      <div className="mx-auto hidden max-w-[1600px] px-8 py-20 md:block lg:py-24">
        {/* Mast-head — eyebrow on the left, cinema-slate metadata on the right. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={stagger(0.07, 0.05)}
          className="flex items-center justify-between border-b border-frame pb-5"
        >
          <motion.div variants={fadeUp} className="text-eyebrow text-sage">
            <ScrambleText text=">> THE PHOTOGRAPHER · ISSUE 01" />
          </motion.div>
          <motion.div variants={fadeUp} className="hidden gap-8 text-eyebrow-sm tabular-nums text-mist lg:flex">
            <span><span className="text-frame-strong">EST</span> 2018</span>
            <span><span className="text-frame-strong">STUDIO</span> SEATTLE</span>
            <span><span className="text-frame-strong">COORDS</span> 47.6° N · 122.3° W</span>
          </motion.div>
          <motion.div variants={fadeUp} className="text-eyebrow-sm tabular-nums text-mist lg:hidden">
            EST 2018 · SEATTLE · 47.6° N
          </motion.div>
        </motion.div>

        <div className="mt-10 grid grid-cols-12 items-start gap-8 lg:gap-12">
          {/* ── Portrait column ─────────────────────────────────────────── */}
          <motion.figure
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="relative col-span-5"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] border border-frame">
              <Image
                src={PORTRAIT}
                alt="Ben Bondarenko, photographer, looking out a window in soft side-light."
                fill
                sizes="(min-width: 1024px) 40vw, 50vw"
                className="object-cover object-[55%_25%]"
              />
              {/* Soft top vignette so the slate labels keep contrast */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(28,31,29,0.42) 0%, rgba(28,31,29,0.0) 25%, rgba(28,31,29,0.0) 65%, rgba(28,31,29,0.78) 100%)",
                }}
              />

              {/* Slate labels */}
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-[2px] border border-paper/35 bg-ink/55 px-2.5 py-1.5 text-eyebrow-sm uppercase text-paper backdrop-blur">
                <span aria-hidden className="block size-[6px] rounded-full bg-sage" />
                PORTRAIT · 01
              </div>
              <div className="absolute right-4 top-4 rounded-[2px] border border-frame bg-ink/45 px-2.5 py-1.5 text-eyebrow-sm tabular-nums text-paper/85 backdrop-blur">
                ƒ/2.8 · 50mm · 1/125s
              </div>

              {/* Bottom plate */}
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                <div className="leading-tight">
                  <div className="font-display text-[1.6rem] text-paper">
                    <em className="not-italic [font-style:italic]">Ben</em> Bondarenko
                  </div>
                  <div className="mt-1 text-eyebrow-sm uppercase text-haze">
                    Lead photographer · Director of light
                  </div>
                </div>
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-paper/45 bg-ink/55 backdrop-blur"
                >
                  <CameraGlyph />
                </span>
              </div>
            </div>
          </motion.figure>

          {/* ── Editorial column ─────────────────────────────────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger(0.08, 0.18)}
            className="col-span-7 flex flex-col"
          >
            {/* Pull quote — the moment. The opening " is absolutely positioned
                so it overlaps the first word of the quote rather than living on
                its own row. Bright sage so it reads as part of the headline. */}
            <motion.blockquote variants={fadeUp} className="relative pl-1">
              <span
                aria-hidden
                className="pointer-events-none absolute -left-3 -top-6 font-display text-[clamp(4rem,5.5vw,7rem)] leading-none text-sage lg:-top-10"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 70, "WONK" 1' }}
              >
                &ldquo;
              </span>
              <p
                className="relative font-display text-[clamp(2.4rem,3.8vw,4.2rem)] leading-[1.0] tracking-[-0.02em] text-paper"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}
              >
                <em className="not-italic [font-style:italic]">Buyers scroll.</em>{" "}
                <span className="text-mist">Yours should be the one</span>{" "}
                <em className="not-italic [font-style:italic]">they slow down for.</em>
              </p>
              <figcaption className="mt-6 flex items-center gap-4 text-eyebrow uppercase text-mist">
                <span aria-hidden className="h-px w-12 bg-sage" />
                <span className="text-paper">Ben Bondarenko</span>
              </figcaption>
            </motion.blockquote>

            {/* Stat row — production credits. Constrained to the column so
                the right-side cell can never push past the grid edge. */}
            <motion.dl
              variants={fadeUp}
              className="mt-10 grid w-full max-w-full grid-cols-3 overflow-hidden border-t border-frame"
            >
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={
                    "flex min-w-0 flex-col gap-2 py-5 " +
                    (i === 0 ? "pr-4" : "border-l border-frame px-4")
                  }
                >
                  <dt className="font-display text-[clamp(1.8rem,2.6vw,3rem)] leading-none text-paper tabular-nums">
                    {s.num}
                  </dt>
                  <dd className="text-eyebrow-sm uppercase text-mist">
                    {s.label}
                  </dd>
                </div>
              ))}
            </motion.dl>

            {/* Trusted-by ticker — desktop only carries the brokerage list. */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-frame pt-5"
            >
              <span className="text-eyebrow text-mist">
                <span className="text-sage">▶</span> TRUSTED&nbsp;BY
              </span>
              <ul className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                {brokerages.map((b, i) => (
                  <li key={b} className="inline-flex items-baseline gap-3">
                    <span className="font-display text-[1.05rem] tracking-tight text-paper [font-style:italic]">
                      {b}
                    </span>
                    {i < brokerages.length - 1 && (
                      <span aria-hidden className="text-frame-strong">·</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                data-cursor="frame"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-frame-strong bg-ink/60 px-4 py-2 text-eyebrow text-paper transition-colors hover:bg-graphite"
              >
                SEE THE WORK
                <span aria-hidden>→</span>
              </a>
              <a
                href="#book"
                data-cursor="frame"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-4 py-2 text-eyebrow text-ink transition-colors hover:bg-sage hover:text-paper"
              >
                BOOK A SHOOT
                <span aria-hidden>→</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CameraGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-paper" aria-hidden>
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" />
      <rect x="0.7" y="3.4" width="12.6" height="7.2" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11" cy="5.4" r="0.6" fill="currentColor" />
    </svg>
  );
}
