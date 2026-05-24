"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { testimonials } from "@/data/testimonials";
import { fadeUp, stagger } from "@/lib/motion-variants";
import ScrambleText from "./fx/scramble-text";

const AUTOPLAY_MS = 6800;
const PAUSE_AFTER_INTERACTION_MS = 9000;
const SMOOTH_SETTLE_MS = 700; // approx duration of scrollTo({behavior:"smooth"})

/**
 * Mobile testimonials carousel — auto-advances every AUTOPLAY_MS, wraps
 * seamlessly via a duplicate of the first card appended at the end, and
 * pauses briefly on manual interaction.
 *
 * Carousel mechanics:
 *  - The DOM lists testimonials.length + 1 cards (the +1 is a clone of card 0).
 *  - `active` tracks the visible card index 0..N (N = testimonials.length).
 *  - When `active === N`, the user is seeing the clone, which visually IS the
 *    first card. After the smooth scroll settles, we jump scrollLeft to the
 *    real card 0 instantly and set active to 0, completing the wrap with no
 *    visible flicker.
 *  - Dots show N positions (testimonials.length). The clone is invisible to
 *    the dot strip; the active dot index is `active % N`.
 */
export default function Testimonials() {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const pausedUntilRef = useRef<number>(0);
  const inViewRef = useRef<boolean>(false);
  const wrappingRef = useRef<boolean>(false);

  // N is the number of REAL testimonials (clone is at index N).
  const N = testimonials.length;
  // Rendered list with the clone appended.
  const slides = [...testimonials, testimonials[0]];

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const isMobile = () =>
    typeof window !== "undefined" &&
    !window.matchMedia("(min-width: 768px)").matches;

  const reducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Centered scrollLeft target for index `i`.
  const targetFor = useCallback((i: number): number | null => {
    const root = scrollerRef.current;
    const el = itemRefs.current[i];
    if (!root || !el) return null;
    return Math.max(0, el.offsetLeft - (root.clientWidth - el.clientWidth) / 2);
  }, []);

  // Programmatic scroll to a slide index. `instant` skips smooth scroll
  // (used for the post-clone snap).
  const scrollToIndex = useCallback(
    (i: number, instant = false) => {
      const root = scrollerRef.current;
      if (!root) return;
      const target = targetFor(i);
      if (target == null) return;
      root.scrollTo({
        left: target,
        behavior: instant ? "auto" : "smooth",
      });
    },
    [targetFor]
  );

  // Track the closest card to the scroller's viewport center as the user
  // swipes or as smooth-scroll runs.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    if (!isMobile()) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (wrappingRef.current) return; // ignore scroll events during the wrap snap
        const center = root.scrollLeft + root.clientWidth / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        for (let i = 0; i < itemRefs.current.length; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;
          const cardCenter = el.offsetLeft + el.clientWidth / 2;
          const dist = Math.abs(cardCenter - center);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
        setActive((prev) => (prev === bestIdx ? prev : bestIdx));
      });
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      root.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Section in-view gating — autoplay runs only while the testimonials section
  // is on screen. Starts false; flipped to true the first time IO fires.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    if (!isMobile()) return;
    const sectionEl = root.closest("section");
    if (!sectionEl) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.15 }
    );
    obs.observe(sectionEl);
    return () => obs.disconnect();
  }, []);

  // Pause autoplay briefly on any manual interaction with the carousel.
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

  // Autoplay loop.
  useEffect(() => {
    if (!isMobile()) return;
    if (reducedMotion()) return;
    const id = setInterval(() => {
      if (Date.now() < pausedUntilRef.current) return;
      if (!inViewRef.current) return;
      if (wrappingRef.current) return;
      const root = scrollerRef.current;
      if (!root) return;

      const cur = activeRef.current;
      const next = cur + 1; // no modulo — we lean on the clone for the wrap

      if (next < slides.length) {
        // Normal forward step (smooth).
        scrollToIndex(next, false);
      }

      if (next === N) {
        // We are scrolling smoothly to the CLONE of card 0. After the smooth
        // scroll settles, snap back to the real first card instantly so the
        // loop continues forward indefinitely without a visible jump.
        wrappingRef.current = true;
        window.setTimeout(() => {
          scrollToIndex(0, true);
          activeRef.current = 0;
          setActive(0);
          // Release the wrap lock on the next frame so the scroll-tracker
          // doesn't fight us during the snap.
          requestAnimationFrame(() => {
            wrappingRef.current = false;
          });
        }, SMOOTH_SETTLE_MS);
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  // Center the initial card on mount (in case the scroller doesn't start at 0).
  useEffect(() => {
    if (!isMobile()) return;
    // Defer to next frame so refs are bound.
    requestAnimationFrame(() => scrollToIndex(0, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i: number) => {
    pausedUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
    scrollToIndex(i, false);
  };

  // The dot index that should be lit. Clone (active === N) maps to dot 0.
  const dotIndex = active >= N ? 0 : active;

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
            <p className="mt-3 hidden text-eyebrow-sm text-mist md:block">
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
          {slides.map((t, i) => {
            const isClone = i === N;
            // Desktop layout only uses the first N items; the clone is
            // suppressed at md+ so the desktop grid stays unchanged.
            return (
              <motion.li
                key={isClone ? `${t.who}-clone` : t.who}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                variants={fadeUp}
                aria-hidden={isClone ? true : undefined}
                className={
                  "snap-center shrink-0 w-[calc(100vw-2rem)] sm:w-[60%] md:w-auto md:shrink " +
                  (isClone
                    ? "md:hidden"
                    : i === 0
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
            );
          })}
        </motion.ul>

        {/* Dot indicators — mobile only. Active dot fills into a line over the
            autoplay interval, visualizing the countdown. Buttons get a 44px hit area. */}
        <div className="mt-4 flex justify-center md:hidden">
          {testimonials.map((t, i) => {
            const isActive = dotIndex === i;
            return (
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
                    "relative block h-1.5 overflow-hidden rounded-full bg-frame-strong transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
                    (isActive ? "w-8" : "w-1.5")
                  }
                >
                  {isActive && (
                    <span
                      // Re-key on every active change so the animation restarts
                      // cleanly when the carousel advances or wraps.
                      key={`bar-${active}`}
                      aria-hidden
                      className="testimonial-countdown absolute inset-y-0 left-0 rounded-full bg-paper"
                      style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <style jsx>{`
          @keyframes testimonial-countdown {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }
          :global(.testimonial-countdown) {
            width: 100%;
            transform-origin: left center;
            transform: scaleX(0);
            animation-name: testimonial-countdown;
            animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
            animation-fill-mode: forwards;
            animation-iteration-count: 1;
            will-change: transform;
          }
          @media (prefers-reduced-motion: reduce) {
            :global(.testimonial-countdown) {
              animation: none;
              transform: scaleX(1);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
