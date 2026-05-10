"use client";

import { motion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

interface Step {
  code: string;
  time: string;
  title: string;
  body: string;
}

const steps: Step[] = [
  {
    code: "01",
    time: "08:30",
    title: "Book online",
    body: "Pick a date, drop the address. No back-and-forth.",
  },
  {
    code: "02",
    time: "10:00",
    title: "Ben shoots on-site",
    body: "Sixty to ninety minutes. Twilight returns at the right hour.",
  },
  {
    code: "03",
    time: "21:00",
    title: "Overnight edit",
    body: "HDR-blended, color-graded by hand. No AI composites.",
  },
  {
    code: "04",
    time: "09:00",
    title: "Delivered next morning",
    body: "Gallery link in your inbox. Drop straight into Zillow.",
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
            <p className="mt-3 text-eyebrow-sm text-mist">
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

        {/* Timeline */}
        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger(0.08)}
          className="relative mt-12 grid gap-px overflow-hidden rounded-[2px] border border-frame bg-frame md:mt-16 md:grid-cols-4"
        >
          {/* Horizontal connector line on desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-[58%] hidden h-px w-full md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
            }}
          />

          {steps.map((s, i) => (
            <motion.li
              key={s.code}
              variants={fadeUp}
              className="relative flex flex-col justify-between bg-ink p-6 md:p-8"
            >
              {/* Top row: code + time */}
              <div className="flex items-center justify-between">
                <span className="font-display text-[2.4rem] leading-none text-paper md:text-[3rem]">
                  <em className="not-italic [font-style:italic]">{s.code}</em>
                </span>
                <span className="rounded-[2px] border border-frame-strong px-2 py-1 text-eyebrow-sm tabular-nums text-paper">
                  {s.time}
                </span>
              </div>

              {/* Marker dot (over the line on desktop) */}
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

        <p className="mt-8 text-eyebrow-sm text-mist">
          ▶ SAME-DAY RUSH AVAILABLE ON REQUEST · NO QUESTION ASKED
        </p>
      </div>
    </section>
  );
}
