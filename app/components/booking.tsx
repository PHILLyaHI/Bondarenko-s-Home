"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion-variants";
import { tiers } from "@/data/pricing";
import LightClock from "./light-clock";
import ScrambleText from "./fx/scramble-text";

const timeSlots = [
  { v: "08:30", label: "08:30", note: "Sunrise" },
  { v: "10:00", label: "10:00", note: "Bright daylight" },
  { v: "12:00", label: "12:00", note: "Hi-key noon" },
  { v: "14:00", label: "14:00", note: "Daylight" },
  { v: "17:00", label: "17:00", note: "Pre-golden" },
  { v: "19:00", label: "19:00", note: "Golden + twilight" },
];

const sizes = [
  { v: "U2500", label: "Up to 2,500 sq ft" },
  { v: "U4000", label: "2,500 – 4,000 sq ft" },
  { v: "OVER",  label: "Over 4,000 sq ft" },
];

function todayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

export default function Booking() {
  const [tier, setTier] = useState("SIG");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("19:00");
  const [size, setSize] = useState("U4000");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const tierInfo = useMemo(() => tiers.find((t) => t.code === tier)!, [tier]);

  const mailto = useMemo(() => {
    const body = [
      `── BONDARENKO HOME PHOTOGRAPHY · BOOKING REQUEST ──`,
      ``,
      `Tier:      ${tierInfo.name}  ($${tierInfo.price})`,
      `Date:      ${date}`,
      `Time:      ${time}`,
      `Size:      ${sizes.find((s) => s.v === size)?.label}`,
      `Address:   ${address || "(to confirm)"}`,
      ``,
      `Name:      ${name}`,
      `Email:     ${email}`,
      `Phone:     ${phone}`,
      ``,
      `Notes:`,
      notes || "(none)",
    ].join("\n");
    const params = new URLSearchParams({
      subject: `Shoot request — ${tierInfo.name} — ${date} ${time}`,
      body,
    });
    return `mailto:ben@bondarenkohomephoto.com?${params.toString()}`;
  }, [tierInfo, date, time, size, address, name, email, phone, notes]);

  return (
    <section
      id="book"
      aria-label="Book a shoot"
      className="relative overflow-hidden bg-ink py-24 md:py-40"
    >
      {/* Sage / blue-hour wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(45,85,96,0.16) 0%, rgba(123,165,144,0.05) 40%, transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.07, 0.05)}
          className="grid gap-12 md:grid-cols-12 md:gap-16"
        >
          {/* Left column: copy */}
          <div className="md:col-span-5">
            <motion.div variants={fadeUp} className="text-eyebrow text-magenta">
              <ScrambleText text=">> BOOK A SHOOT" />
            </motion.div>
            {/* Mobile gets a punched-up title; desktop unchanged via display-2 utility. */}
            <motion.h2
              variants={fadeUp}
              className="font-display text-[3rem] leading-[0.95] tracking-[-0.02em] mt-5 max-w-[16ch] sm:text-[3.4rem] md:hidden"
            >
              <span className="text-paper">No phone tag.</span>{" "}
              <em className="not-italic [font-style:italic] text-paper">
                Pick a slot,
              </em>{" "}
              <span className="text-mist">we'll be there.</span>
            </motion.h2>
            <motion.h2 variants={fadeUp} className="display-2 hidden mt-5 max-w-[16ch] md:block">
              <span className="text-paper">No phone tag.</span>{" "}
              <em className="not-italic [font-style:italic] text-paper">
                Pick a slot,
              </em>{" "}
              <span className="text-mist">we'll be there.</span>
            </motion.h2>

            <motion.div variants={fadeUp} className="mt-8 max-w-md text-base text-haze">
              Ben replies within an hour, 7am to 9pm Pacific. Same-day rush, call directly.
            </motion.div>

            {/* Light clock — desktop only; on mobile it's redundant with the hero. */}
            <motion.div variants={fadeUp} className="mt-8 hidden md:inline-block">
              <LightClock />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 space-y-3">
              <ContactRow label="DIRECT" value="(206) 555-0142" href="tel:+12065550142" />
              <ContactRow label="EMAIL" value="ben@bondarenkohomephoto.com" href="mailto:ben@bondarenkohomephoto.com" />
              <ContactRow label="INSTAGRAM" value="@bondarenkohomephoto" href="https://instagram.com/bondarenkohomephoto" external />
            </motion.div>
          </div>

          {/* Right column: form */}
          <motion.form
            variants={fadeUp}
            className="md:col-span-7"
            onSubmit={(e) => {
              e.preventDefault();
              if (typeof window !== "undefined") {
                window.location.href = mailto;
              }
            }}
          >
            <div className="rounded-[3px] border border-frame bg-graphite/40 p-5 md:p-8">
              {/* Mobile-only form-section eyebrow so the card reads unmistakably as a form. */}
              <div className="mb-6 text-eyebrow text-magenta md:hidden">
                <span aria-hidden>▶ </span>REQUEST A SHOOT
              </div>

              {/* Tier picker */}
              <Field label="01 · TIER">
                <div className="flex flex-wrap gap-2">
                  {tiers.map((t) => {
                    const sel = tier === t.code;
                    return (
                      <button
                        key={t.code}
                        type="button"
                        onClick={() => setTier(t.code)}
                        className={
                          "rounded-full border px-3 py-2 text-eyebrow-sm transition-colors " +
                          (sel
                            ? "border-magenta bg-magenta text-paper"
                            : "border-frame text-mist hover:text-paper hover:border-frame-strong")
                        }
                      >
                        {t.name} · ${t.price}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {/* Date + Size */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Field label="02 · DATE">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent border-b border-paper/30 md:border-frame-strong px-0 py-2 text-paper tabular-nums focus:outline-none focus:border-paper"
                  />
                </Field>
                <Field label="03 · SIZE">
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-ink border-b border-paper/30 md:border-frame-strong px-0 py-2 text-paper focus:outline-none focus:border-paper"
                  >
                    {sizes.map((s) => (
                      <option key={s.v} value={s.v} className="bg-ink">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Time slots */}
              <Field label="04 · TIME · LIGHT" className="mt-6">
                <div className="-mx-1 flex flex-wrap gap-2">
                  {timeSlots.map((t) => {
                    const sel = time === t.v;
                    return (
                      <button
                        key={t.v}
                        type="button"
                        onClick={() => setTime(t.v)}
                        className={
                          "flex flex-col items-start gap-0.5 rounded-[2px] border px-3 py-2 text-left text-eyebrow-sm transition-colors " +
                          (sel
                            ? "border-paper bg-paper text-ink"
                            : "border-frame text-mist hover:text-paper hover:border-frame-strong")
                        }
                      >
                        <span className="tabular-nums">{t.label}</span>
                        <span className={"text-[0.55rem] " + (sel ? "text-ink/70" : "text-mist")}>
                          {t.note}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              {/* Address */}
              <Field label="05 · PROPERTY ADDRESS" className="mt-6">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="123 Lakeview Dr, Mercer Island, WA"
                  className="w-full bg-transparent border-b border-paper/30 md:border-frame-strong px-0 py-2 text-paper placeholder:text-paper/55 md:placeholder:text-mist/60 focus:outline-none focus:border-paper"
                />
              </Field>

              {/* Contact */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Field label="06 · NAME">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-transparent border-b border-paper/30 md:border-frame-strong px-0 py-2 text-paper placeholder:text-paper/55 md:placeholder:text-mist/60 focus:outline-none focus:border-paper"
                  />
                </Field>
                <Field label="07 · EMAIL">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@brokerage.com"
                    className="w-full bg-transparent border-b border-paper/30 md:border-frame-strong px-0 py-2 text-paper placeholder:text-paper/55 md:placeholder:text-mist/60 focus:outline-none focus:border-paper"
                  />
                </Field>
              </div>

              <Field label="08 · PHONE" className="mt-6">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(206) 555-0000"
                  className="w-full bg-transparent border-b border-paper/30 md:border-frame-strong px-0 py-2 text-paper placeholder:text-paper/55 md:placeholder:text-mist/60 focus:outline-none focus:border-paper"
                />
              </Field>

              <Field label="09 · NOTES" className="mt-6">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Twilight requested? Vacant or staged? Anything tricky about the property?"
                  className="w-full resize-none bg-transparent border border-paper/30 md:border-frame-strong rounded-[2px] px-3 py-2 text-paper placeholder:text-paper/55 md:placeholder:text-mist/60 focus:outline-none focus:border-paper"
                />
              </Field>

              <div className="mt-8 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-eyebrow-sm text-mist">
                  ▶ SUBMITS VIA YOUR MAIL CLIENT · NO ACCOUNT REQUIRED
                </p>
                <button
                  type="submit"
                  className="group inline-flex items-center justify-between gap-3 rounded-full bg-paper px-5 py-3 text-eyebrow text-ink transition-colors hover:bg-magenta hover:text-paper"
                >
                  SEND BOOKING REQUEST
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={"block " + className}>
      {/* Mobile gets brighter labels so the form reads as foreground; desktop label color unchanged. */}
      <span className="block text-eyebrow-sm text-haze md:text-mist">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function ContactRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-baseline justify-between gap-3 border-b border-frame py-2 text-paper transition-colors hover:border-frame-strong"
    >
      <span className="text-eyebrow-sm text-mist">{label}</span>
      <span className="truncate font-display text-[1rem] normal-case tracking-tight transition-colors group-hover:text-magenta md:text-[1.1rem]">
        {value}
      </span>
    </a>
  );
}

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
