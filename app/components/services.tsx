"use client";

import { motion } from "motion/react";
import { type Service, services } from "@/data/services";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

// Tailwind class set used as the persistent base tint (gradient overlay).
// Values bumped from previous round so the colors read clearly the entire time
// the section is in view, not only during the entrance fade.
const tintByLight: Record<Service["light"], string> = {
  DAYLIGHT:
    "from-daylight/35 via-daylight/12 to-transparent",
  GOLDEN:
    "from-golden/45 via-golden/15 to-transparent",
  TWILIGHT:
    "from-twilight/55 via-magenta/22 to-transparent",
  "BLUE-HOUR":
    "from-blue-hour/55 via-blue-hour/18 to-transparent",
  INTERIOR:
    "from-interior/50 via-interior/15 to-transparent",
};

// Solid color (with alpha) used for the cursor-following radial gradient.
// Mirrors the OKLCH-tinted neutrals defined in globals.css.
const cursorColorByLight: Record<Service["light"], string> = {
  DAYLIGHT: "rgba(184, 197, 208, 0.55)",
  GOLDEN: "rgba(200, 152, 96, 0.6)",
  TWILIGHT: "rgba(62, 107, 93, 0.7)",
  "BLUE-HOUR": "rgba(45, 85, 96, 0.7)",
  INTERIOR: "rgba(212, 165, 116, 0.6)",
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
            const cursorColor = cursorColorByLight[s.light];

            const onMove = (e: React.MouseEvent<HTMLLIElement>) => {
              const r = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * 100;
              const y = ((e.clientY - r.top) / r.height) * 100;
              e.currentTarget.style.setProperty("--mx", `${x}%`);
              e.currentTarget.style.setProperty("--my", `${y}%`);
            };

            return (
              <motion.li
                key={s.code}
                variants={fadeUp}
                data-cursor="frame"
                onMouseMove={onMove}
                style={{
                  // CSS variables consumed by the cursor-following overlay.
                  // Default values place the radial center at top-left when no
                  // mouse has moved yet (e.g. on initial render).
                  ["--mx" as string]: "20%",
                  ["--my" as string]: "20%",
                  ["--cursor-color" as string]: cursorColor,
                }}
                className={
                  "group relative flex h-full flex-col justify-between overflow-hidden rounded-[2px] border border-frame bg-graphite/40 p-3 transition-colors hover:border-frame-strong md:p-6 " +
                  (wide ? "md:col-span-2 md:row-span-1" : "")
                }
              >
                {/* Persistent base tint — slow, subtle drift so the colors feel alive while the section is in view. */}
                <div
                  aria-hidden
                  className={
                    "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr opacity-100 services-tint " +
                    tintByLight[s.light]
                  }
                />

                {/* Cursor-following radial gradient — only renders on devices with a real hover-capable cursor. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at var(--mx) var(--my), var(--cursor-color) 0%, transparent 55%)",
                  }}
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

      {/* Subtle slow drift on the gradient background-position so the tint feels
          alive while the section is in view. Pure CSS, GPU-cheap, respects reduced motion. */}
      <style jsx>{`
        :global(.services-tint) {
          background-size: 140% 140%;
          background-position: 0% 0%;
          animation: tintDrift 18s ease-in-out infinite alternate;
        }
        @keyframes tintDrift {
          from { background-position: 0% 0%; }
          to   { background-position: 100% 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.services-tint) { animation: none; }
        }
      `}</style>
    </section>
  );
}
