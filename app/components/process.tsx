"use client";

import { motion } from "motion/react";
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
 * Mobile workflow — call-sheet row stack.
 *
 * Each step renders as an editorial row: time column on the left, big
 * italic Fraunces frame number on the right, then title + body spanning
 * underneath. Rows are separated by a visible hairline border so the
 * schedule beat is clear without competing typographic chrome.
 */
function MobileFilmstrip({ steps }: { steps: Step[] }) {
  return (
    <div className="relative mt-8 md:hidden">
      <div className="mb-5 flex items-center justify-between text-[0.58rem] tracking-[0.22em] uppercase tabular-nums text-mist">
        <span className="text-paper">CALL SHEET · SHOOT DAY</span>
        <span className="text-haze">04 SCENES</span>
      </div>

      <ol>
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

      <div className="mt-4 flex items-center gap-3 text-[0.58rem] tracking-[0.22em] uppercase text-haze">
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
      variants={stagger(0.07, 0.05)}
      className={
        "grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 pb-6 " +
        (isLast ? "" : "mb-6 border-b border-paper/25")
      }
    >
      {/* Time column */}
      <motion.div
        variants={{
          hidden: { x: -14, opacity: 0 },
          visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="flex flex-col items-start gap-1.5 pt-1"
      >
        <span className="text-[0.52rem] tracking-[0.24em] uppercase tabular-nums text-mist">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="font-mono text-[0.92rem] tabular-nums text-paper">
          {step.time}
        </span>
      </motion.div>

      {/* Frame number — big italic Fraunces, anchor on the right */}
      <motion.span
        aria-hidden
        variants={{
          hidden: { opacity: 0, scale: 0.75, rotate: -5 },
          visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
          },
        }}
        className="row-span-1 self-start justify-self-end font-display text-[2.9rem] leading-[0.85] text-paper"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1' }}
      >
        <em className="not-italic [font-style:italic]">{step.code}</em>
      </motion.span>

      {/* Content column (spans both grid columns underneath) */}
      <div className="col-span-2 -mt-1">
        <motion.h3
          variants={{
            hidden: { y: 14, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
            },
          }}
          className="font-display text-[1.3rem] leading-[1.08] tracking-[-0.012em] text-paper"
        >
          {step.title}
        </motion.h3>
        <motion.p
          variants={fadeUp}
          className="mt-2 max-w-[44ch] text-[0.85rem] leading-[1.5] text-paper/75"
        >
          {step.body}
        </motion.p>
      </div>
    </motion.li>
  );
}
