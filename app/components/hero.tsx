"use client";

import Image from "next/image";
import { motion } from "motion/react";
import LightClock from "./light-clock";
import { stagger, fadeUp } from "@/lib/motion-variants";
import { frames, frameSrc } from "@/data/portfolio";

const heroFrame = frames.find((f) => f.id === "luxury-01") ?? frames[0];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink"
    >
      {/* Background image (signature twilight) */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={frameSrc(heroFrame, 2400)}
          alt={heroFrame.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.78] saturate-[1.05]"
        />
        {/* Soft vignette so the photo reads but the type stays legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,31,29,0.40) 0%, rgba(28,31,29,0.10) 38%, rgba(28,31,29,0.55) 78%, rgba(28,31,29,0.92) 100%)",
          }}
        />
        {/* Bottom-left sage glow, very subtle */}
        <div
          className="absolute inset-y-0 left-[-10%] w-[55%] opacity-25"
          style={{
            background:
              "radial-gradient(closest-side, rgba(123,165,144,0.45), transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Single side rail (mono label) — desktop only */}
      <div className="pointer-events-none absolute inset-y-0 left-3 hidden flex-col justify-end pb-24 md:flex">
        <div className="text-eyebrow-sm text-mist [writing-mode:vertical-rl] rotate-180">
          47.6° N · 122.3° W
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-between px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger(0.07, 0.2)}
          className="grid gap-6 md:grid-cols-12 md:gap-8"
        >
          <motion.div variants={fadeUp} className="hidden md:col-span-9 md:block">
            <div className="text-eyebrow text-mist">
              <span className="text-magenta">▼</span> BONDARENKO HOME PHOTOGRAPHY
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="ml-auto w-fit md:col-span-3 md:col-start-10 md:w-auto"
          >
            <LightClock compactMobile />
          </motion.div>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={stagger(0.08, 0.35)}
          className="display-1 mt-12 max-w-[18ch] text-paper md:mt-0"
        >
          <motion.span variants={fadeUp} className="block text-mist">
            Make your
          </motion.span>
          <motion.span variants={fadeUp} className="block">
            <em className="not-italic font-display [font-style:italic] text-paper">
              listing
            </em>{" "}
            <span className="text-mist">the one</span>
          </motion.span>
          <motion.span variants={fadeUp} className="block">
            <em className="not-italic font-display [font-style:italic] text-paper">
              buyers
            </em>{" "}
            <span className="text-mist">click first.</span>
          </motion.span>
        </motion.h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger(0.06, 1.1)}
          className="mt-12 grid gap-8 md:mt-0 md:grid-cols-12 md:items-end md:gap-8"
        >
          <motion.p
            variants={fadeUp}
            className="text-base text-haze md:col-span-5 md:text-lg"
          >
            Cinematic real estate photography across the Puget Sound.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end"
          >
            <a
              href="#work"
              data-cursor="frame"
              className="group inline-flex items-center gap-3 rounded-full border border-frame-strong bg-graphite/40 px-5 py-3 text-eyebrow text-paper backdrop-blur transition-colors hover:bg-graphite/80"
            >
              SEE THE WORK
              <ArrowDown className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#book"
              data-cursor="frame"
              className="group inline-flex items-center gap-3 rounded-full bg-paper px-5 py-3 text-eyebrow text-ink transition-colors hover:bg-magenta hover:text-paper"
            >
              BOOK A SHOOT
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center md:bottom-6">
        <div className="text-eyebrow-sm text-mist tabular-nums">
          SCROLL ↓
        </div>
      </div>
    </section>
  );
}

function ArrowDown({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path d="M7 1V13M7 13L1 7M7 13L13 7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
