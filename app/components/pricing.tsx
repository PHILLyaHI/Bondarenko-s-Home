"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { type PricingTier, tiers } from "@/data/pricing";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

export default function Pricing() {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState<number>(() =>
    Math.max(0, tiers.findIndex((t) => t.intensity === 3))
  );

  // On mount (mobile only), set scrollLeft so the Signature card is centered.
  // Uses scrollLeft directly (not scrollIntoView) so the page's vertical scroll never moves.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) return;
    const sig = tiers.findIndex((t) => t.intensity === 3);
    if (sig < 0) return;
    const el = cardRefs.current[sig];
    if (!el) return;
    const target = el.offsetLeft - (root.clientWidth - el.clientWidth) / 2;
    root.scrollLeft = Math.max(0, target);
    setActive(sig);
  }, []);

  // Track which card is closest to viewport center via IntersectionObserver.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const idx = cardRefs.current.indexOf(visible[0].target as HTMLLIElement);
          if (idx >= 0) setActive(idx);
        }
      },
      { root, threshold: [0.55, 0.75, 1] }
    );
    cardRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const goTo = (i: number) => {
    const root = scrollerRef.current;
    const el = cardRefs.current[i];
    if (!root || !el) return;
    const target = el.offsetLeft - (root.clientWidth - el.clientWidth) / 2;
    root.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  };

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="relative bg-ink py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <div className="text-eyebrow text-magenta">
              <ScrambleText text=">> PRICING" />
            </div>
            <p className="mt-3 text-eyebrow-sm text-mist">
              THREE TIERS · NO HIDDEN LINE-ITEMS
            </p>
          </div>

          <div className="md:col-span-9">
            <h2 className="display-2 max-w-[18ch]">
              <span className="text-paper">Three exposures.</span>{" "}
              <span className="text-mist">Pick the one</span>{" "}
              <em className="not-italic [font-style:italic] text-paper">
                your buyer's eye
              </em>{" "}
              <span className="text-mist">deserves.</span>
            </h2>
          </div>
        </div>

        <motion.ul
          ref={scrollerRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.08, 0.05)}
          className="mt-12 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:mt-20 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0"
        >
          {tiers.map((t, i) => (
            <li
              key={t.code}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="snap-center shrink-0 w-[calc(100vw-7rem)] md:w-auto md:shrink"
            >
              <Tier tier={t} />
            </li>
          ))}
        </motion.ul>

        {/* Dot indicators — mobile only. Buttons get a 44px hit area; the visible dot stays small. */}
        <div className="mt-4 flex justify-center md:hidden">
          {tiers.map((t, i) => (
            <button
              key={t.code}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${t.name} tier`}
              className="grid h-11 w-11 place-items-center"
            >
              <span
                aria-hidden
                className={
                  "block h-1.5 rounded-full transition-all duration-300 " +
                  (active === i ? "w-6 bg-paper" : "w-1.5 bg-frame-strong")
                }
              />
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-eyebrow-sm text-mist md:mt-10">
          ▶ TRAVEL FEES APPLY BEYOND 30 MILES OF SEATTLE · KING COUNTY INCLUDED
        </p>
      </div>
    </section>
  );
}

function Tier({ tier }: { tier: PricingTier }) {
  const featured = tier.intensity === 3;
  return (
    <motion.div
      variants={fadeUp}
      data-cursor="frame"
      className={
        "group relative flex h-full flex-col overflow-hidden rounded-[3px] border bg-graphite/40 p-6 md:p-8 " +
        (featured
          ? "border-sage/55 md:scale-[1.02] md:py-10 ring-1 ring-sage/30"
          : "border-frame")
      }
    >
      {/* Gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: gradientFor(tier.intensity) }}
      />

      {featured && (
        <span className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-[2px] bg-sage px-3 py-1 text-eyebrow-sm text-ink">
          MOST BOOKED
        </span>
      )}

      <div className="flex items-start justify-between">
        <div>
          <div className="text-eyebrow-sm text-mist">[{tier.code}]</div>
          <h3 className="mt-2 font-display text-[2rem] leading-none text-paper md:text-[2.5rem]">
            {tier.name}
          </h3>
        </div>
        <div className="text-right">
          <div className="font-display text-[2.2rem] leading-none text-paper tabular-nums md:text-[2.6rem]">
            ${tier.price}
          </div>
          <div className="mt-1 text-eyebrow-sm tabular-nums text-mist">
            {tier.exposure}
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-[32ch] text-sm text-haze">{tier.tagline}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-frame py-4 text-eyebrow-sm">
        <dt className="text-mist">DELIVERY</dt>
        <dd className="text-right text-paper">{tier.delivery}</dd>
        <dt className="text-mist">SIZE</dt>
        <dd className="text-right text-paper">{tier.squareFt}</dd>
      </dl>

      <ul className="mt-6 space-y-3">
        {tier.includes.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-paper">
            <span
              aria-hidden
              className="mt-[7px] block size-[6px] flex-shrink-0 rounded-full bg-sage"
              style={{ boxShadow: "0 0 6px var(--color-sage)" }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <a
        href="#book"
        className={
          "mt-8 inline-flex items-center justify-between rounded-full px-4 py-3 text-eyebrow transition-colors " +
          (featured
            ? "bg-paper text-ink hover:bg-sage hover:text-ink"
            : "border border-frame-strong text-paper hover:bg-graphite/80")
        }
      >
        BOOK {tier.name.toUpperCase()}
        <span aria-hidden>→</span>
      </a>
    </motion.div>
  );
}

function gradientFor(intensity: 1 | 2 | 3): string {
  switch (intensity) {
    case 1:
      return "linear-gradient(180deg, rgba(184,197,208,0.06) 0%, rgba(28,31,29,1) 70%)";
    case 2:
      return "linear-gradient(180deg, rgba(212,165,116,0.10) 0%, rgba(28,31,29,1) 70%)";
    case 3:
      return "linear-gradient(180deg, rgba(123,165,144,0.22) 0%, rgba(62,107,93,0.14) 35%, rgba(28,31,29,1) 80%)";
  }
}
