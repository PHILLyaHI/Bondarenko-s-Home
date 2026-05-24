"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion-variants";
import { getLightConditionAt } from "@/lib/light-hours";

export default function Footer() {
  const [sun, setSun] = useState<{ sunrise: string; sunset: string } | null>(null);
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    const info = getLightConditionAt();
    setSun({ sunrise: info.sunrise, sunset: info.sunset });
    const d = new Date();
    setToday(
      d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-frame bg-ink">
      <div className="mx-auto max-w-[1600px] px-4 pb-8 pt-20 md:px-8 md:pt-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.07, 0.05)}
          className="grid gap-12 md:grid-cols-12 md:gap-8"
        >
          {/* Left column: contact */}
          <div className="md:col-span-5">
            <motion.div variants={fadeUp} className="text-eyebrow text-mist">
              <span className="text-magenta">▼</span> CONTACT
            </motion.div>

            <motion.ul variants={fadeUp} className="mt-6 space-y-4">
              <li>
                <a
                  href="tel:+12065550142"
                  className="group flex items-baseline justify-between border-b border-frame py-3"
                >
                  <span className="text-eyebrow-sm text-mist">CALL</span>
                  <span className="font-display text-[1.4rem] text-paper transition-colors group-hover:text-magenta md:text-[1.6rem]">
                    (206) 555-0142
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:ben@bondarenkohomephoto.com"
                  className="group flex items-baseline justify-between border-b border-frame py-3"
                >
                  <span className="text-eyebrow-sm text-mist">EMAIL</span>
                  <span className="font-display text-[1rem] text-paper transition-colors group-hover:text-magenta md:text-[1.15rem]">
                    ben@bondarenkohomephoto.com
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/bondarenkohomephoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-baseline justify-between border-b border-frame py-3"
                >
                  <span className="text-eyebrow-sm text-mist">INSTAGRAM</span>
                  <span className="font-display text-[1.2rem] text-paper transition-colors group-hover:text-magenta md:text-[1.4rem]">
                    @bondarenkohomephoto
                  </span>
                </a>
              </li>
            </motion.ul>
          </div>

          {/* Right column: meta — hidden on mobile per editorial pass; keeps the footer clean on phone. */}
          <motion.div variants={fadeUp} className="hidden md:col-span-7 md:block">
            <div className="text-eyebrow text-mist">
              <span className="text-magenta">▼</span> SEATTLE LIGHT TODAY
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              <Stat label="DATE" value={today || "—"} />
              <Stat label="SUNRISE" value={sun?.sunrise ?? "—"} mono />
              <Stat label="SUNSET" value={sun?.sunset ?? "—"} mono />
              <Stat label="SERVICE AREA" value="King County" />
              <Stat label="STUDIO HOURS" value="7am–9pm PT" />
              <Stat label="FAA PART 107" value="Active · drone certified" />
            </dl>

            <div className="mt-8 grid gap-3 text-eyebrow-sm text-mist">
              <p>
                ▶ EVERY FRAME EDITED BY HAND BY BEN BONDARENKO. NO STOCK. NO AI
                COMPOSITES.
              </p>
              <p>
                ▶ TRAVEL FEES APPLY BEYOND 30 MILES OF SEATTLE.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Wordmark — massive on desktop, stacked on mobile */}
        <div className="mt-20 select-none overflow-hidden md:mt-32">
          {/* Desktop / tablet: 2-line clamp wordmark — capped so "Bondarenko" never overflows the viewport at any desktop width. */}
          <h2
            className="hidden font-display leading-[0.85] tracking-[-0.04em] text-paper sm:block"
            style={{
              fontSize: "clamp(3rem, 16vw, 13rem)",
              fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
            }}
          >
            <span className="block">Bondarenko</span>
            <span className="block text-frame-strong">
              <em className="not-italic [font-style:italic]">Home</em>
              {" "}Photography
            </span>
          </h2>
          {/* Mobile: 3-line stack, fits viewport. Sized so the longest word
             ("Photography", 11ch) fits inside container at 360px viewport. */}
          <h2
            className="block font-display leading-[0.95] tracking-[-0.04em] text-paper sm:hidden"
            style={{
              fontSize: "clamp(2.25rem, 13vw, 4.5rem)",
              fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
            }}
          >
            <span className="block">Bondarenko</span>
            <span className="block text-frame-strong">
              <em className="not-italic [font-style:italic]">Home</em>
            </span>
            <span className="block text-frame-strong">Photography</span>
          </h2>
        </div>

        {/* Legal row */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-frame pt-6 text-eyebrow-sm text-mist">
          <span>© {new Date().getFullYear()} BONDARENKO HOME PHOTOGRAPHY · SEATTLE</span>
          <span className="tabular-nums">v1.0 · BUILT IN THE PUGET SOUND</span>
        </div>
      </div>

      {/* Sticky bottom CTA on mobile */}
      <StickyCTA />
    </footer>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-t border-frame pt-3">
      <dt className="text-eyebrow-sm text-mist">{label}</dt>
      <dd className={"mt-1 text-paper " + (mono ? "font-mono tabular-nums text-base" : "text-base")}>
        {value}
      </dd>
    </div>
  );
}

function StickyCTA() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  const [bookingVisible, setBookingVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolledPastHero(y > window.innerHeight * 0.8);
      setNearBottom(max > 0 ? y / max > 0.92 : false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById("book");
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setBookingVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px", threshold: 0 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  const show = scrolledPastHero && !bookingVisible && !nearBottom;

  return (
    <div
      className={
        "fixed inset-x-0 bottom-0 z-40 flex justify-center pt-8 pb-3 transition-all duration-300 md:hidden " +
        "bg-gradient-to-t from-ink via-ink/85 to-transparent " +
        (show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none")
      }
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href="#book"
        className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-eyebrow text-ink shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      >
        BOOK A SHOOT
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
