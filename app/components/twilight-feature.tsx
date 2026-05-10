"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { frames, frameSrc } from "@/data/portfolio";
import { fadeUp, stagger } from "@/lib/motion-variants";

const featureFrame = frames.find((f) => f.id === "luxury-03") ?? frames[0];

export default function TwilightFeature() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <section
      ref={ref}
      aria-label="Twilight signature"
      className="relative isolate overflow-hidden bg-ink py-0 md:py-0"
    >
      <div className="relative h-[70svh] min-h-[460px] w-full md:h-[120svh] md:min-h-[680px]">
        <motion.div
          style={{ y, scale }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src={frameSrc(featureFrame, 2400)}
            alt={featureFrame.alt}
            fill
            sizes="100vw"
            className="object-cover object-[50%_38%] md:object-center"
          />
        </motion.div>

        {/* Atmospheric wash — soft teal + ink */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,31,29,0.30) 0%, rgba(45,85,96,0.18) 50%, rgba(28,31,29,0.85) 100%)",
          }}
        />

        {/* Top-left meta */}
        <div className="absolute left-4 top-6 text-eyebrow text-paper md:left-8 md:top-10">
          <span className="text-sage">▼</span> THE SIGNATURE · TWILIGHT
        </div>

        {/* Top-right meta — hidden on mobile to avoid colliding with left-side label */}
        <div className="absolute right-4 top-6 hidden text-eyebrow-sm tabular-nums text-paper/90 sm:block md:right-8 md:top-10">
          {featureFrame.location} · {featureFrame.light}
        </div>

        {/* Pull-quote */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger(0.08, 0.1)}
          className="absolute inset-x-4 bottom-12 max-w-[26ch] md:inset-x-8 md:bottom-20 md:max-w-[34ch]"
        >
          <motion.p variants={fadeUp} className="display-2 text-paper">
            <em className="not-italic [font-style:italic]">
              His&nbsp;signature.
            </em>
            <span className="text-mist"> The moment the lights come on.</span>
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-6"
          >
            <span className="rounded-full border border-paper/40 bg-ink/30 px-3 py-1.5 text-eyebrow-sm text-paper backdrop-blur">
              3× SAVES ON ZILLOW
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
