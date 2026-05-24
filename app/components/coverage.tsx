"use client";

import { motion } from "motion/react";
import { cities, radius } from "@/data/coverage";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

export default function Coverage() {
  return (
    <section
      id="coverage"
      aria-label="Coverage area"
      className="relative bg-ink py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            {/* Coverage eyebrow: brighter on mobile so it doesn't drown in the ink background. */}
            <div className="text-eyebrow text-daylight md:text-blue-hour">
              <ScrambleText text=">> COVERAGE" />
            </div>
            <p className="mt-3 text-eyebrow-sm text-haze md:text-mist">{radius.toUpperCase()}</p>
          </div>

          <div className="md:col-span-9">
            <h2 className="display-2 max-w-[18ch]">
              <span className="text-paper">Seven cities,</span>{" "}
              <em className="not-italic [font-style:italic] text-paper">
                one Sound,
              </em>{" "}
              <span className="text-paper md:text-mist">on call by sunrise.</span>
            </h2>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:gap-8">
          {/* Map — phone gets a square crop + larger SVG text via the .bp-mobile selector. */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative md:col-span-8"
          >
            <Blueprint />
          </motion.div>

          {/* City list */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger(0.06, 0.1)}
            className="md:col-span-4"
          >
            {cities.map((c, i) => (
              <motion.li
                key={c.name}
                variants={fadeUp}
                className="flex items-baseline justify-between border-b border-frame py-4 md:py-4"
              >
                <span className="text-eyebrow-sm tabular-nums text-haze md:text-mist">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <span className="flex-1 px-4 font-display text-[1.65rem] text-paper md:text-[1.4rem]">
                  {c.name}
                </span>
                <span className="text-eyebrow-sm tabular-nums text-haze md:text-mist">
                  {c.tier === "core" ? "CORE" : "EDGE"}
                </span>
              </motion.li>
            ))}
            <li className="mt-6 text-eyebrow-sm text-haze md:text-mist">
              ▶ TRAVEL FEES BEYOND 30 MILES · ASK ABOUT WHIDBEY, BAINBRIDGE,
              POULSBO
            </li>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

function Blueprint() {
  return (
    <div className="coverage-map relative aspect-[5/4] w-full overflow-hidden rounded-[2px] border border-frame bg-gradient-to-br from-blue-hour/30 via-ink to-ink p-3 md:aspect-[4/3] md:p-6">
      {/* Outer corner brackets */}
      <CornerBrackets />

      <svg
        viewBox="0 0 100 75"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern
            id="bp-grid"
            x="0"
            y="0"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 5 0 L 0 0 0 5"
              fill="none"
              stroke="rgba(184,197,208,0.10)"
              strokeWidth="0.15"
            />
          </pattern>
          <radialGradient id="bp-glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(184,197,208,0.2)" />
            <stop offset="100%" stopColor="rgba(184,197,208,0)" />
          </radialGradient>
        </defs>

        <rect width="100" height="75" fill="url(#bp-grid)" />

        {/* Abstract Sound coastline */}
        <path
          d="M 8 20 Q 14 32 20 38 T 32 56 T 36 70 M 38 18 Q 44 24 48 28 T 56 36 T 60 60 M 80 8 Q 84 16 86 24 T 90 38"
          fill="none"
          stroke="rgba(184,197,208,0.25)"
          strokeWidth="0.3"
          strokeDasharray="0.5 0.7"
        />

        {/* Concentric coverage circle around Seattle (28, 38) */}
        <circle
          cx="28"
          cy="38"
          r="18"
          fill="none"
          stroke="rgba(123,165,144,0.22)"
          strokeWidth="0.25"
          strokeDasharray="0.6 1"
        />
        <circle
          cx="28"
          cy="38"
          r="28"
          fill="none"
          stroke="rgba(184,197,208,0.10)"
          strokeWidth="0.2"
          strokeDasharray="0.4 1.2"
        />

        {/* City dots */}
        {cities.map((c) => (
          <g key={c.name}>
            <circle
              cx={c.x}
              cy={c.y}
              r={c.tier === "core" ? 4 : 3}
              fill="url(#bp-glow)"
            />
            <circle
              cx={c.x}
              cy={c.y}
              r={c.tier === "core" ? 0.9 : 0.7}
              fill="rgba(250,247,242,1)"
            />
            <text
              x={c.x + 1.6}
              y={c.y - 1.4}
              fill="rgba(250,247,242,0.85)"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="1.4"
              letterSpacing="0.02"
            >
              {c.name.toUpperCase()}
            </text>
            <text
              x={c.x + 1.6}
              y={c.y + 1}
              fill="rgba(250,247,242,0.4)"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="0.9"
            >
              {c.tier === "core" ? "● CORE" : "○ EDGE"}
            </text>
          </g>
        ))}

        {/* Compass */}
        <g transform="translate(92, 8)" fill="rgba(184,197,208,0.6)">
          <circle r="2.4" fill="none" stroke="rgba(184,197,208,0.4)" strokeWidth="0.2" />
          <text x="-0.6" y="-3" fontFamily="IBM Plex Mono, monospace" fontSize="1.2">N</text>
          <path d="M 0 -1.8 L 0.5 0.5 L 0 0 L -0.5 0.5 Z" fill="rgba(123,165,144,0.95)" />
        </g>

        {/* Scale legend */}
        <g transform="translate(8, 70)" fill="rgba(184,197,208,0.5)" fontSize="1.2" fontFamily="IBM Plex Mono, monospace">
          <line x1="0" y1="0" x2="10" y2="0" stroke="rgba(184,197,208,0.5)" strokeWidth="0.2" />
          <text x="0" y="-1">0</text>
          <text x="10" y="-1" textAnchor="end">10 MI</text>
        </g>
      </svg>

      {/* Top label */}
      <div className="absolute left-3 top-3 text-eyebrow-sm text-haze md:left-6 md:top-6 md:text-mist">
        PUGET SOUND · SERVICE BLUEPRINT
      </div>
      <div className="absolute right-3 top-3 hidden text-eyebrow-sm text-mist sm:block md:right-6 md:top-6">
        47.6° N · 122.3° W
      </div>

      {/* Mobile-only: enlarge SVG text + brighten city dots so the map reads on a phone.
          Selectors are scoped to .coverage-map and only fire below the md breakpoint. */}
      <style jsx>{`
        @media (max-width: 767px) {
          :global(.coverage-map text) {
            font-size: 2.4px;
            fill: rgba(250, 247, 242, 0.95);
          }
          :global(.coverage-map text[font-size="0.9"]) {
            font-size: 1.7px;
            fill: rgba(250, 247, 242, 0.7);
          }
          :global(.coverage-map text[font-size="1.2"]) {
            font-size: 1.9px;
          }
          :global(.coverage-map text[font-size="1.4"]) {
            font-size: 2.3px;
          }
        }
      `}</style>
    </div>
  );
}

function CornerBrackets() {
  return (
    <>
      <span className="absolute left-1 top-1 size-2 border-l border-t border-paper/40" />
      <span className="absolute right-1 top-1 size-2 border-r border-t border-paper/40" />
      <span className="absolute bottom-1 left-1 size-2 border-b border-l border-paper/40" />
      <span className="absolute bottom-1 right-1 size-2 border-b border-r border-paper/40" />
    </>
  );
}
