"use client";

import { motion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

export default function Manifesto() {
  return (
    <section
      aria-label="Studio manifesto"
      className="relative overflow-hidden bg-ink"
    >
      {/* Soft golden warm wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[120%] -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 25%, rgba(200,152,96,0.10) 0%, rgba(200,152,96,0.03) 40%, transparent 75%)",
        }}
      />

      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-24 md:grid-cols-12 md:gap-8 md:px-8 md:py-40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger(0.08, 0.05)}
          className="md:col-span-3"
        >
          <motion.div variants={fadeUp} className="text-eyebrow text-golden">
            <ScrambleText text=">> THE STUDIO" />
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 text-eyebrow-sm text-mist">
            Est. 2018 · Seattle, WA
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger(0.07, 0.1)}
          className="md:col-span-9"
        >
          <motion.h2 variants={fadeUp} className="display-2 max-w-[20ch]">
            <span className="text-paper">Buyers scroll.</span>{" "}
            <span className="text-mist">
              Yours should be the one
            </span>{" "}
            <em className="not-italic [font-style:italic] text-paper">
              they slow down for.
            </em>
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="mt-10 max-w-[52ch] space-y-4 text-base leading-[1.6] text-haze md:space-y-0 md:text-lg md:leading-normal"
          >
            <p>
              Eight years across the Puget Sound. Twelve hundred listings.
            </p>
            <p className="md:mt-3">
              Same hands behind every shutter, lit for the way a feed scrolls
              past a thumbnail.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#work"
              data-cursor="frame"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-frame-strong bg-ink/60 px-4 py-2 text-eyebrow text-paper transition-colors hover:bg-graphite sm:min-h-0"
            >
              SEE THE WORK
              <span aria-hidden>→</span>
            </a>
            <a
              href="#book"
              data-cursor="frame"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-4 py-2 text-eyebrow text-ink transition-colors hover:bg-sage hover:text-paper sm:min-h-0"
            >
              BOOK A SHOOT
              <span aria-hidden>→</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
