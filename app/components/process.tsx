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
 * Filmstrip-style vertical timeline for mobile.
 *
 * - A sage rail runs down the left side, anchored to the section's scroll
 *   progress: it fills from top to bottom as the user scrolls through the
 *   section, so the timeline visually "develops" as you read.
 * - Each step is rendered as a filmstrip frame: large italic Fraunces number
 *   on the rail, a numbered marker, and a card with title + body + caption.
 * - Sprocket ticks decorate the rail.
 * - Steps stagger in: marker stamps (scale + rotate), title slides from right,
 *   body fades up. Each step's reveal triggers once on viewport entry.
 */
function MobileFilmstrip({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Begin filling when the strip enters the bottom of viewport;
    // top-out when the strip's bottom hits the viewport top.
    offset: ["start 80%", "end 25%"],
  });
  // Soften the progress so the fill chases the scroll without jitter.
  const railFill = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.4,
  });
  const railHeight = useTransform(railFill, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);

  return (
    <div
      ref={ref}
      className="relative mt-14 md:hidden"
      style={{
        // Mask makes the rail fade at the very top and bottom edges.
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, black 4%, black 96%, transparent 100%)",
        maskImage:
          "linear-gradient(180deg, transparent 0%, black 4%, black 96%, transparent 100%)",
      }}
    >
      {/* Static rail (track) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[28px] top-0 bottom-0 w-px bg-frame-strong/55"
      />
      {/* Animated fill rail — scaled to scroll progress */}
      <motion.span
        aria-hidden
        style={{ height: railHeight }}
        className="pointer-events-none absolute left-[28px] top-0 w-px origin-top"
      >
        <span
          aria-hidden
          className="block h-full w-px"
          style={{
            background:
              "linear-gradient(180deg, rgba(123,165,144,0) 0%, rgba(123,165,144,0.85) 22%, rgba(212,165,116,0.85) 78%, rgba(200,152,96,0) 100%)",
            boxShadow: "0 0 12px rgba(123,165,144,0.5)",
          }}
        />
        {/* Leading edge dot */}
        <span
          aria-hidden
          className="absolute -bottom-[5px] left-1/2 size-[10px] -translate-x-1/2 rounded-full bg-sage"
          style={{ boxShadow: "0 0 12px var(--color-sage)" }}
        />
      </motion.span>

      {/* Sprocket ticks */}
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute left-[22px] h-px w-3 bg-frame-strong/55"
          style={{ top: `${(i + 1) * (100 / 30)}%` }}
        />
      ))}

      <ol className="relative">
        {steps.map((s, i) => (
          <FilmFrame key={s.code} step={s} index={i} total={steps.length} />
        ))}
      </ol>
    </div>
  );
}

function FilmFrame({
  step,
  index,
  total,
}: {
  step: Step;
  index: number;
  total: number;
}) {
  return (
    <motion.li
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.45 }}
      variants={stagger(0.08, 0.05)}
      className="relative pl-16 pb-12 last:pb-0"
    >
      {/* Numbered marker — stamps in with a small rotate so it feels printed */}
      <motion.span
        aria-hidden
        variants={{
          hidden: { scale: 0.55, rotate: -8, opacity: 0 },
          visible: {
            scale: 1,
            rotate: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="absolute left-0 top-1 grid size-[56px] place-items-center rounded-full border border-frame-strong bg-ink font-display text-[1.25rem] leading-none text-paper"
        style={{
          boxShadow:
            "0 0 0 5px var(--color-ink), 0 0 22px rgba(123,165,144,0.35)",
        }}
      >
        <em className="not-italic [font-style:italic]">{step.code}</em>
      </motion.span>

      {/* Time pill — slides down into place */}
      <motion.span
        aria-hidden
        variants={{
          hidden: { y: -6, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="mb-3 inline-flex items-center gap-2 text-[0.58rem] tracking-[0.22em] uppercase tabular-nums text-mist"
      >
        <span className="text-frame-strong">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <span aria-hidden className="block h-px w-4 bg-frame-strong" />
        <span className="text-paper">{step.time}</span>
      </motion.span>

      {/* Filmstrip frame — card with title sliding from right, body fading up */}
      <div className="relative overflow-hidden rounded-[3px] border border-frame bg-graphite/55">
        {/* Frame sprocket strip along the top */}
        <div
          aria-hidden
          className="flex h-3 items-center justify-around border-b border-frame bg-ink/60"
        >
          {Array.from({ length: 12 }).map((_, k) => (
            <span
              key={k}
              className="block h-1.5 w-1.5 rounded-[1px] bg-frame-strong/70"
            />
          ))}
        </div>

        <div className="p-5">
          <motion.h3
            variants={{
              hidden: { x: 24, opacity: 0 },
              visible: {
                x: 0,
                opacity: 1,
                transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="font-display text-[1.45rem] leading-[1.1] text-paper"
          >
            {step.title}
          </motion.h3>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-[0.95rem] leading-snug text-haze"
          >
            {step.body}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-5 flex items-center justify-between gap-3 border-t border-frame pt-3 text-[0.58rem] tracking-[0.22em] uppercase tabular-nums text-mist"
          >
            <span className="text-paper">{step.caption}</span>
            <span aria-hidden className="font-mono">
              FRAME · {String(index + 1).padStart(2, "0")}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.li>
  );
}
