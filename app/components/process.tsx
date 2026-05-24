"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

interface Step {
  code: string;
  time: string;
  title: string;
  body: string;
  /** Two-word tag used as a mono caption on the filmstrip frame. */
  caption: string;
}

const steps: Step[] = [
  {
    code: "01",
    time: "08:30",
    title: "Book online",
    body: "Pick a date, drop the address. No back-and-forth, no quote forms.",
    caption: "BOOKED · NO PHONE TAG",
  },
  {
    code: "02",
    time: "10:00",
    title: "Ben shoots on-site",
    body: "Sixty to ninety minutes. Twilight returns at the right hour, no extra trip.",
    caption: "ON LOCATION · 60–90 MIN",
  },
  {
    code: "03",
    time: "21:00",
    title: "Overnight edit",
    body: "HDR-blended, color-graded by hand. No AI composites, no flat tone-mapping.",
    caption: "BENCH · HAND-GRADED",
  },
  {
    code: "04",
    time: "09:00",
    title: "Delivered next morning",
    body: "Gallery link in your inbox. Drop the photos straight into Zillow and Compass.",
    caption: "DELIVERED · UNDER 24H",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      aria-label="How it works"
      className="relative bg-ink py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <div className="text-eyebrow text-daylight">
              <ScrambleText text=">> THE SHOOT DAY" />
            </div>
            <p className="mt-3 hidden text-eyebrow-sm text-mist md:block">
              FROM BOOKING TO LIVE LISTING
            </p>
          </div>

          <div className="md:col-span-9">
            <h2 className="display-2 max-w-[20ch]">
              <span className="text-paper">A complete listing kit,</span>{" "}
              <em className="not-italic [font-style:italic] text-paper">
                under 24 hours.
              </em>
            </h2>
          </div>
        </div>

        {/* Desktop timeline — unchanged grid + horizontal connector. */}
        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger(0.08)}
          className="relative mt-16 hidden gap-px overflow-hidden rounded-[2px] border border-frame bg-frame md:grid md:grid-cols-4"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-[58%] hidden h-px w-full md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
            }}
          />
          {steps.map((s) => (
            <motion.li
              key={s.code}
              variants={fadeUp}
              className="relative flex flex-col justify-between bg-ink p-6 md:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[2.4rem] leading-none text-paper md:text-[3rem]">
                  <em className="not-italic [font-style:italic]">{s.code}</em>
                </span>
                <span className="rounded-[2px] border border-frame-strong px-2 py-1 text-eyebrow-sm tabular-nums text-paper">
                  {s.time}
                </span>
              </div>
              <div className="my-6 hidden items-center md:flex">
                <span
                  aria-hidden
                  className="block size-3 rounded-full border border-paper bg-ink"
                  style={{ boxShadow: "0 0 14px rgba(184,197,208,0.6)" }}
                />
              </div>
              <div>
                <h3 className="font-display text-[1.5rem] leading-tight text-paper md:text-[1.75rem]">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[28ch] text-sm text-haze">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {/* Mobile timeline — filmstrip layout with scroll-driven rail fill. */}
        <MobileFilmstrip steps={steps} />

        <p className="mt-8 hidden text-eyebrow-sm text-mist md:block">
          ▶ SAME-DAY RUSH AVAILABLE ON REQUEST · NO QUESTION ASKED
        </p>
      </div>
    </section>
  );
}

/**
 * Mobile "Call Sheet" timeline.
 *
 * Aesthetic — a film-set production board / publication call sheet:
 *  - A horizontal 24-hour day arc at the top, scaled to the section's scroll
 *    progress. A glowing dot traces from blue-hour through golden to dusk
 *    and back, marking where you are in the workflow as you scroll.
 *  - Below the arc, the four steps are laid out as editorial rows:
 *    big italic Fraunces frame number on the right, mono time stamp on the
 *    left, display title, body. A hairline rule separates rows like a
 *    schedule.
 *  - Each row reveals on entry: the time slides from the left, the number
 *    stamps in with a tiny rotation, title slides up, body fades.
 *  - One bold typographic move per row, otherwise restrained chrome — the
 *    professionalism the user asked for comes from the proportions.
 */
function MobileFilmstrip({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 30%"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.45,
  });
  const arcDotLeft = useTransform(smooth, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);
  const arcFillWidth = useTransform(smooth, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);

  // Markers along the day arc, positioned by their notional hour 0–24.
  // 08:30 → 35.4% ; 10:00 → 41.6% ; 21:00 → 87.5% ; +1d 09:00 → reuse 37.5%
  // We layout them as ascending fractions across the arc visually.
  const arcStops = [
    { time: "08:30", pos: 0.05, label: "Book" },
    { time: "10:00", pos: 0.32, label: "Shoot" },
    { time: "21:00", pos: 0.68, label: "Edit" },
    { time: "09:00", pos: 0.95, label: "Deliver" },
  ];

  return (
    <div ref={ref} className="relative mt-10 md:hidden">
      {/* ── Call-sheet header strip ─────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between text-[0.58rem] tracking-[0.22em] uppercase tabular-nums text-mist">
        <span className="text-paper">CALL SHEET · SHOOT DAY</span>
        <span className="text-haze">04 SCENES</span>
      </div>

      {/* ── 24-hour day arc ─────────────────────────────────────────────── */}
      <div className="relative h-[68px] w-full">
        {/* Hour ticks */}
        <div className="absolute inset-x-0 top-7 flex justify-between">
          {Array.from({ length: 25 }).map((_, k) => (
            <span
              key={k}
              aria-hidden
              className={
                "block w-px " +
                (k % 6 === 0 ? "h-2.5 bg-paper/70" : "h-1.5 bg-frame-strong")
              }
            />
          ))}
        </div>
        {/* Hour rail (track) */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-[27px] h-px"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.06) 100%)",
          }}
        />
        {/* Day-color fill — chases scroll progress */}
        <motion.div
          aria-hidden
          style={{ width: arcFillWidth }}
          className="absolute left-0 top-[26px] h-[3px] origin-left rounded-full"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(45,85,96,0) 0%, rgba(123,165,144,0.85) 18%, rgba(200,152,96,0.9) 55%, rgba(62,107,93,0.95) 82%, rgba(45,85,96,0.6) 100%)",
              boxShadow: "0 0 14px rgba(200,152,96,0.45)",
            }}
          />
        </motion.div>
        {/* Marker stops with labels */}
        {arcStops.map((stop, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute top-0"
            style={{ left: `${stop.pos * 100}%`, transform: "translateX(-50%)" }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-[0.55rem] tracking-[0.18em] tabular-nums text-paper">
                {stop.time}
              </span>
              <span className="block size-2 rounded-full border border-paper/60 bg-ink" />
              <span className="text-[0.5rem] tracking-[0.22em] uppercase text-haze">
                {stop.label}
              </span>
            </div>
          </div>
        ))}
        {/* Moving day-position indicator */}
        <motion.span
          aria-hidden
          style={{ left: arcDotLeft }}
          className="absolute top-[22px] -translate-x-1/2"
        >
          <span
            className="block size-[14px] rounded-full bg-paper"
            style={{
              boxShadow:
                "0 0 0 4px var(--color-ink), 0 0 12px rgba(200,152,96,0.75)",
            }}
          />
        </motion.span>
      </div>

      {/* ── Editorial row stack ─────────────────────────────────────────── */}
      <ol className="mt-12">
        {steps.map((s, i) => (
          <CallSheetRow
            key={s.code}
            step={s}
            index={i}
            total={steps.length}
            isLast={i === steps.length - 1}
          />
        ))}
      </ol>

      {/* ── Footnote ───────────────────────────────────────────────────── */}
      <div className="mt-6 flex items-center gap-3 text-[0.58rem] tracking-[0.22em] uppercase text-haze">
        <span aria-hidden className="h-px flex-1 bg-frame-strong" />
        <span>SAME-DAY RUSH · ON REQUEST</span>
        <span aria-hidden className="h-px flex-1 bg-frame-strong" />
      </div>
    </div>
  );
}

function CallSheetRow({
  step,
  index,
  total,
  isLast,
}: {
  step: Step;
  index: number;
  total: number;
  isLast: boolean;
}) {
  return (
    <motion.li
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.45 }}
      variants={stagger(0.08, 0.05)}
      className={
        "grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 pb-8 " +
        (isLast ? "" : "mb-8 border-b border-frame")
      }
    >
      {/* Time column */}
      <motion.div
        variants={{
          hidden: { x: -16, opacity: 0 },
          visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="flex flex-col items-start gap-2 pt-1"
      >
        <span className="text-[0.55rem] tracking-[0.24em] uppercase tabular-nums text-mist">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="font-mono text-[1.05rem] tabular-nums text-paper">
          {step.time}
        </span>
        <span className="text-[0.55rem] tracking-[0.22em] uppercase text-haze">
          {step.caption}
        </span>
      </motion.div>

      {/* Frame number — big italic Fraunces, anchor on the right */}
      <motion.span
        aria-hidden
        variants={{
          hidden: { opacity: 0, scale: 0.7, rotate: -6 },
          visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
          },
        }}
        className="row-span-1 self-start justify-self-end font-display text-[3.6rem] leading-[0.85] text-paper"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1' }}
      >
        <em className="not-italic [font-style:italic]">{step.code}</em>
      </motion.span>

      {/* Content column (spans both grid columns underneath) */}
      <div className="col-span-2 -mt-2">
        <motion.h3
          variants={{
            hidden: { y: 18, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
            },
          }}
          className="font-display text-[1.6rem] leading-[1.05] tracking-[-0.012em] text-paper"
        >
          {step.title}
        </motion.h3>
        <motion.p
          variants={fadeUp}
          className="mt-3 max-w-[44ch] text-[0.95rem] leading-[1.55] text-paper/75"
        >
          {step.body}
        </motion.p>

        {/* Hairline connector + index pip — sits at the bottom of each row's
            content so the eye gets a horizontal cue between scenes. */}
        <motion.div
          variants={fadeUp}
          className="mt-5 flex items-center gap-3"
        >
          <span aria-hidden className="block h-px w-12 bg-paper/55" />
          <span className="text-[0.55rem] tracking-[0.24em] uppercase tabular-nums text-paper/60">
            SCENE · {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="block h-px flex-1 bg-frame-strong" />
        </motion.div>
      </div>
    </motion.li>
  );
}
