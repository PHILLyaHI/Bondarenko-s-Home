"use client";

import { motion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion-variants";

const stats = [
  { num: "1,200+", label: "LISTINGS PHOTOGRAPHED" },
  { num: "32%", label: "FASTER AVERAGE SALES" },
  { num: "8 YR", label: "ACROSS THE PUGET SOUND" },
];

const brokerages = [
  "Windermere",
  "Compass",
  "John L. Scott",
  "Redfin",
  "Coldwell Banker",
  "Keller Williams",
  "RE/MAX",
  "Sotheby's",
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Trust signals"
      className="relative border-y border-frame bg-graphite/30"
    >
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8 md:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger(0.08, 0.05)}
          className="grid grid-cols-1 gap-8 md:grid-cols-12"
        >
          <motion.div variants={fadeUp} className="md:col-span-3">
            <div className="text-eyebrow text-mist">
              <span className="text-sage">▶</span> TRUSTED&nbsp;BY
            </div>
            <p className="mt-3 max-w-[28ch] text-sm text-haze">
              Listing agents at the Sound's top brokerages.
            </p>
          </motion.div>

          <div className="md:col-span-9 md:border-l md:border-frame md:pl-8">
            <dl className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8">
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className="flex flex-col gap-1.5 border-t border-frame pt-2.5 sm:gap-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0 md:border-l-0 md:pl-0"
                >
                  <dt className="font-display text-[1.5rem] leading-none text-paper sm:text-[1.75rem] md:text-[3.5rem] md:leading-[1.02]">
                    {s.num}
                  </dt>
                  <dd className="font-mono text-[0.55rem] tracking-[0.18em] uppercase text-mist leading-snug md:text-eyebrow-sm">
                    {s.label}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>

      {/* Brokerage marquee */}
      <div
        className="relative overflow-hidden border-t border-frame py-5"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="flex animate-marquee whitespace-nowrap will-change-transform">
          {[...brokerages, ...brokerages, ...brokerages].map((b, i) => (
            <span
              key={i}
              className="mx-8 inline-flex items-center gap-8 text-eyebrow text-mist"
            >
              <span className="font-display text-[1.25rem] tracking-tight text-paper [font-style:italic]">
                {b}
              </span>
              <span aria-hidden className="text-frame-strong">
                ✕
              </span>
            </span>
          ))}
        </div>

        <style jsx>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
          .animate-marquee {
            animation: marquee 38s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-marquee { animation: none; }
          }
        `}</style>
      </div>
    </section>
  );
}
