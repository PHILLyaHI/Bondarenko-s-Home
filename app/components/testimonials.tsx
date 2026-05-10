"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { testimonials } from "@/data/testimonials";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

const AUTOPLAY_MS = 7000;
const PAUSE_AFTER_INTERACTION_MS = 10000;

export default function Testimonials() {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const pausedUntilRef = useRef<number>(0);
  const inViewRef = useRef<boolean>(true);

  // Keep activeRef in sync so the long-lived autoplay interval reads the
  // latest value without needing to re-create itself on every state change.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const isMobile = () =>
    typeof window !== "undefined" &&
    !window.matchMedia("(min-width: 768px)").matches;

  const reducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pick the card whose center is closest to the scroller viewport center.
  // More reliable than IntersectionObserver during a smooth-scroll because
  // the IO can lag the scroll position.
  const computeActiveFromScroll = () => {
    const root = scrollerRef.current;
    if (!root) return null;
    const center = root.scrollLeft + root.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const cardCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });
    return bestIdx;
  };

  // Track which mobile card is closest to viewport center via scroll events
  // (real-time, fires throughout manual swipe + smooth scroll).
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    if (!isMobile()) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = computeActiveFromScroll();
        if (idx != null) setActive(idx);
      });
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      root.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Track section in-view so autoplay only runs when visible.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    if (!isMobile()) return;
    const sectionEl = root.closest("section");
    if (!sectionEl) return;
    const obs = new IntersectionObserver(
      ([entry]) => { inViewRef.current = entry.isIntersecting; },
      { threshold: 0.2 }
    );
    obs.observe(sectionEl);
    return () => obs.disconnect();
  }, []);

  // Pause autoplay 10s on any manual interaction (touch, wheel, pointerdown).
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    if (!isMobile()) return;
    const markInteraction = () => {
      pausedUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
    };
    root.addEventListener("touchstart", markInteraction, { passive: true });
    root.addEventListener("wheel", markInteraction, { passive: true });
    root.addEventListener("pointerdown", markInteraction);
    return () => {
      root.removeEventListener("touchstart", markInteraction);
      root.removeEventListener("wheel", markInteraction);
      root.removeEventListener("pointerdown", markInteraction);
    };
  }, []);

  // Autoplay: long-lived interval, no deps. Reads latest active via ref so it
  // never tears down. Loops infinitely. Skips when paused, when reduced-motion,
  // or when section is offscreen.
  useEffect(() => {
    if (!isMobile()) return;
    if (reducedMotion()) return;
    const id = setInterval(() => {
      if (Date.now() < pausedUntilRef.current) return;
      if (!inViewRef.current) return;
      const root = scrollerRef.current;
      if (!root) return;
      const next = (activeRef.current + 1) % testimonials.length;
      const el = itemRefs.current[next];
      if (!el) return;
      const target = el.offsetLeft - (root.clientWidth - el.clientWidth) / 2;
      root.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  const goTo = (i: number) => {
    pausedUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
    const root = scrollerRef.current;
    const el = itemRefs.current[i];
    if (!root || !el) return;
    const target = el.offsetLeft - (root.clientWidth - el.clientWidth) / 2;
    root.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  };

  return (
    <section
      aria-label="Testimonials"
      className="relative bg-graphite/30 py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <div className="text-eyebrow text-golden">
              <ScrambleText text=">> THE WORD" />
            </div>
            <p className="mt-3 text-eyebrow-sm text-mist">
              LISTING AGENTS ON BEN
            </p>
          </div>

          <div className="md:col-span-9">
            {/* Mobile-only title (bumped up); desktop uses the original display-2 utility unchanged. */}
            <h2 className="font-display text-[2.6rem] leading-[0.96] tracking-[-0.02em] max-w-[18ch] sm:text-[3rem] md:hidden">
              <span className="text-paper">What the agents</span>{" "}
              <em className="not-italic [font-style:italic] text-paper">
                actually
              </em>{" "}
              <span className="text-mist">say.</span>
            </h2>
            <h2 className="display-2 hidden max-w-[18ch] md:block">
              <span className="text-paper">What the agents</span>{" "}
              <em className="not-italic [font-style:italic] text-paper">
                actually
              </em>{" "}
              <span className="text-mist">say.</span>
            </h2>
          </div>
        </div>

        <motion.ul
          ref={scrollerRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.1)}
          className="mt-12 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:mt-20 md:grid md:grid-cols-12 md:gap-8 md:overflow-visible md:px-0"
        >
          {testimonials.map((t, i) => (
            <motion.li
              key={t.who}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              variants={fadeUp}
              className={
                "snap-center shrink-0 w-[calc(100vw-2rem)] sm:w-[60%] md:w-auto md:shrink " +
                (i === 0
                  ? "md:col-span-5"
                  : i === 1
                  ? "md:col-span-4 md:col-start-7 md:mt-12"
                  : "md:col-span-5 md:col-start-2 md:mt-4")
              }
            >
              <figure className="relative flex h-full flex-col gap-4 border-t border-frame pt-6 md:gap-6 md:border-l md:border-t-0 md:border-magenta md:pl-7 md:pt-0">
                <span
                  aria-hidden
                  className="font-display text-[3rem] leading-none text-sage opacity-70 md:text-[5rem] md:opacity-60"
                >
                  &ldquo;
                </span>
                <blockquote className="font-display text-[1.3rem] leading-snug text-paper md:text-[1.8rem]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-auto pt-4 text-eyebrow-sm text-mist tabular-nums">
                  <div className="text-paper">
                    {t.who}
                  </div>
                  <div className="mt-1">
                    {t.brokerage} · {t.detail}
                  </div>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </motion.ul>

        {/* Dot indicators — mobile only. Buttons get a 44px hit area; the visible dot stays small. */}
        <div className="mt-4 flex justify-center md:hidden">
          {testimonials.map((t, i) => (
            <button
              key={t.who}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
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
      </div>
    </section>
  );
}
