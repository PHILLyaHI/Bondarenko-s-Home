"use client";

import { motion } from "motion/react";
import { type Service, services } from "@/data/services";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

// Per-light tints applied via inline `background` so the saturated hover
// state always renders — Tailwind dynamic class concatenation can drop edge
// utilities in arbitrary builds, and the desktop hover effect is too central
// to leave to chance. The hover tint is a bold near-solid fill (matches the
// "color before scroll fade" the user wanted recreated on hover); the base
// tint stays a quiet directional gradient.
const tintByLight: Record<
  Service["light"],
  { base: string; hover: string; highlight: string }
> = {
  DAYLIGHT: {
    base: "linear-gradient(135deg, rgba(184,197,208,0.10) 0%, rgba(184,197,208,0.02) 60%, transparent 100%)",
    hover: "linear-gradient(135deg, rgba(184,197,208,0.45) 0%, rgba(184,197,208,0.32) 55%, rgba(184,197,208,0.18) 100%)",
    highlight: "rgba(184, 197, 208, 0.55)",
  },
  GOLDEN: {
    base: "linear-gradient(135deg, rgba(200,152,96,0.12) 0%, rgba(200,152,96,0.03) 60%, transparent 100%)",
    hover: "linear-gradient(135deg, rgba(200,152,96,0.62) 0%, rgba(200,152,96,0.45) 55%, rgba(200,152,96,0.22) 100%)",
    highlight: "rgba(200, 152, 96, 0.6)",
  },
  TWILIGHT: {
    base: "linear-gradient(135deg, rgba(62,107,93,0.18) 0%, rgba(62,107,93,0.05) 60%, transparent 100%)",
    hover: "linear-gradient(135deg, rgba(62,107,93,0.70) 0%, rgba(62,107,93,0.50) 55%, rgba(123,165,144,0.25) 100%)",
    highlight: "rgba(62, 107, 93, 0.7)",
  },
  "BLUE-HOUR": {
    base: "linear-gradient(135deg, rgba(45,85,96,0.18) 0%, rgba(45,85,96,0.05) 60%, transparent 100%)",
    hover: "linear-gradient(135deg, rgba(45,85,96,0.72) 0%, rgba(45,85,96,0.50) 55%, rgba(45,85,96,0.22) 100%)",
    highlight: "rgba(45, 85, 96, 0.7)",
  },
  INTERIOR: {
    base: "linear-gradient(135deg, rgba(212,165,116,0.14) 0%, rgba(212,165,116,0.04) 60%, transparent 100%)",
    hover: "linear-gradient(135deg, rgba(212,165,116,0.62) 0%, rgba(212,165,116,0.44) 55%, rgba(212,165,116,0.20) 100%)",
    highlight: "rgba(212, 165, 116, 0.6)",
  },
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
            <p className="mt-3 hidden text-eyebrow-sm text-mist md:block">
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
            const tints = tintByLight[s.light];

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
                  ["--mx" as string]: "50%",
                  ["--my" as string]: "50%",
                  ["--cursor-color" as string]: tints.highlight,
                }}
                className={
                  "group relative flex h-full flex-col justify-between overflow-hidden rounded-[2px] border border-frame bg-graphite/40 p-3 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-paper/60 md:p-6 " +
                  (wide ? "md:col-span-2 md:row-span-1" : "")
                }
              >
                {/* Resting base tint — quiet directional wash. Painted via inline
                    style so the alpha always reaches the browser, regardless of
                    Tailwind dynamic-class purging. */}
                <span
                  aria-hidden
                  className="services-tint pointer-events-none absolute inset-0 z-0"
                  style={{ background: tints.base }}
                />

                {/* Hover saturated tint — the card's individual color rises in
                    on cursor enter and decays out on leave. Bold, near-solid
                    fill so it reads as a true color change, not a faint hue. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
                  style={{ background: tints.hover }}
                />

                {/* Cursor-following radial highlight — localized warmth where
                    the pointer sits. Above the hover wash, under the content. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at var(--mx) var(--my), var(--cursor-color) 0%, transparent 60%)",
                  }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="text-[0.55rem] tracking-[0.2em] text-mist tabular-nums md:text-eyebrow-sm">
                    [{String(i + 1).padStart(2, "0")}]
                  </div>
                  <div className="rounded-[2px] border border-frame-strong bg-ink/40 px-1.5 py-0.5 text-[0.55rem] tracking-[0.2em] text-paper backdrop-blur-sm md:px-2 md:py-1 md:text-eyebrow-sm">
                    {s.code}
                  </div>
                </div>

                <div className="relative z-10 mt-6 md:mt-16">
                  <h3 className="font-display text-[1.15rem] leading-[1.1] text-paper md:text-[2rem] md:leading-[1.05]">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-[0.78rem] leading-snug text-paper/80 md:mt-3 md:text-sm">{s.blurb}</p>
                </div>

                {/* Light/arrow row — desktop only on mobile this would just add weight */}
                <div className="relative z-10 mt-3 hidden items-center justify-between text-eyebrow-sm text-mist md:mt-6 md:flex">
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
