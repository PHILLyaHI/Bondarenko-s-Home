"use client";

import { motion } from "motion/react";
import { type Service, services } from "@/data/services";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

const tintByLight: Record<Service["light"], string> = {
  DAYLIGHT:
    "from-daylight/20 via-daylight/5 to-transparent",
  GOLDEN:
    "from-golden/30 via-golden/8 to-transparent",
  TWILIGHT:
    "from-twilight/35 via-magenta/15 to-transparent",
  "BLUE-HOUR":
    "from-blue-hour/35 via-blue-hour/10 to-transparent",
  INTERIOR:
    "from-interior/30 via-interior/8 to-transparent",
};

export default function Services() {
  return (
    <section
      id="services"
      aria-label="Services"
      className="relative bg-ink py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <div className="text-eyebrow text-interior">
              <ScrambleText text=">> SERVICES" />
            </div>
            <p className="mt-3 text-eyebrow-sm text-mist">
              EIGHT WAYS TO LIGHT A LISTING
            </p>
          </div>

          <div className="md:col-span-9">
            <h2 className="display-2 max-w-[16ch]">
              <span className="text-paper">Pick the </span>
              <em className="not-italic [font-style:italic] text-paper">
                exposure
              </em>
              <span className="text-mist"> your home asks for.</span>
            </h2>
          </div>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger(0.05)}
          className="mt-12 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-4 md:gap-4"
        >
          {services.map((s, i) => {
            const wide = s.code === "TWI" || s.code === "RUSH";
            return (
              <motion.li
                key={s.code}
                variants={fadeUp}
                data-cursor="frame"
                className={
                  "group relative flex h-full flex-col justify-between overflow-hidden rounded-[2px] border border-frame bg-graphite/40 p-3 transition-colors hover:border-frame-strong md:p-6 " +
                  (wide ? "md:col-span-2 md:row-span-1" : "")
                }
              >
                {/* Light tint overlay */}
                <div
                  aria-hidden
                  className={
                    "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr opacity-80 " +
                    tintByLight[s.light]
                  }
                />

                <div className="flex items-start justify-between">
                  <div className="text-[0.55rem] tracking-[0.2em] text-mist tabular-nums md:text-eyebrow-sm">
                    [{String(i + 1).padStart(2, "0")}]
                  </div>
                  <div className="rounded-[2px] border border-frame-strong px-1.5 py-0.5 text-[0.55rem] tracking-[0.2em] text-paper md:px-2 md:py-1 md:text-eyebrow-sm">
                    {s.code}
                  </div>
                </div>

                <div className="mt-6 md:mt-16">
                  <h3 className="font-display text-[1.15rem] leading-[1.1] text-paper md:text-[2rem] md:leading-[1.05]">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-[0.78rem] leading-snug text-haze md:mt-3 md:text-sm">{s.blurb}</p>
                </div>

                {/* Light/arrow row — desktop only on mobile this would just add weight */}
                <div className="mt-3 hidden items-center justify-between text-eyebrow-sm text-mist md:mt-6 md:flex">
                  <span>{s.light.replace("-", " ")}</span>
                  <span
                    aria-hidden
                    className="inline-flex translate-x-0 items-center transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
