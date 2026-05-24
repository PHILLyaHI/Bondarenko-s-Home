"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { type Frame, frameSrc } from "@/data/portfolio";

interface GalleryCardProps {
  frame: Frame;
  index: number;
  total: number;
  onOpen?: (frame: Frame) => void;
}

const colSpanByAspect: Record<Frame["aspect"], string> = {
  wide: "md:col-span-8 row-span-2",
  tall: "md:col-span-4 row-span-3",
  square: "md:col-span-4 row-span-2",
};

const aspectByAspect: Record<Frame["aspect"], string> = {
  wide: "aspect-[16/10]",
  tall: "aspect-[3/4]",
  square: "aspect-[4/5]",
};

/**
 * Per-card hover tint — reuses the same color-by-light-hour vocabulary
 * the services section uses on scroll. Card colors fade in on hover and
 * decay back to neutral on exit, the same gesture in reverse.
 *
 * Each Frame's `light` field starts with a light-hour keyword
 * ("Daylight · 14:32", "Golden Hour · …", "Twilight · …", "Blue Hour · …").
 * We sniff the prefix and map it to a tint that mirrors the OKLCH-tinted
 * neutrals defined in globals.css.
 */
function tintForLight(light: string): string {
  const head = light.toLowerCase();
  if (head.startsWith("twilight")) return "rgba(62, 107, 93, 0.55)"; // sage / twilight
  if (head.startsWith("blue")) return "rgba(45, 85, 96, 0.55)";       // blue hour
  if (head.startsWith("golden")) return "rgba(200, 152, 96, 0.55)";   // golden
  if (head.startsWith("interior")) return "rgba(212, 165, 116, 0.55)"; // interior
  return "rgba(184, 197, 208, 0.45)";                                  // daylight default
}

export default function GalleryCard({
  frame,
  index,
  total,
  onOpen,
}: GalleryCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen?.(frame)}
      data-cursor="frame"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 6) * 0.04 }}
      className={
        "group relative flex flex-col text-left " +
        "col-span-1 " +
        colSpanByAspect[frame.aspect]
      }
      aria-label={`Open ${frame.title}, ${frame.category.toLowerCase()} in ${frame.location}`}
    >
      {/* Image frame */}
      <div
        className={
          "relative w-full overflow-hidden rounded-[2px] border border-frame " +
          aspectByAspect[frame.aspect]
        }
        style={{ ["--card-tint" as string]: tintForLight(frame.light) }}
      >
        <Image
          src={frameSrc(frame, frame.aspect === "wide" ? 1800 : 1200)}
          alt={frame.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        {/* Hover color tint — same color-appearance gesture the section uses on scroll,
            re-triggered per card when the cursor hovers. Hover-capable pointers only. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] mix-blend-screen [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 60%, var(--card-tint) 0%, transparent 70%)",
          }}
        />

        {/* Overlay gradient on hover */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Top-left category tag */}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[2px] border border-frame-strong bg-ink/60 px-2 py-1 text-eyebrow-sm text-paper backdrop-blur-md">
          <span aria-hidden className="block size-[5px] rounded-full bg-magenta" />
          {frame.category}
        </div>

        {/* Top-right frame counter */}
        <div className="absolute right-3 top-3 rounded-[2px] border border-frame bg-ink/40 px-2 py-1 text-eyebrow-sm text-mist tabular-nums backdrop-blur">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        {/* Bottom-right arrow (title moves below the image on mobile, overlays on hover desktop) */}
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-end sm:justify-between">
          <span className="hidden font-display text-[1.15rem] leading-tight text-paper opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:inline">
            {frame.title}
          </span>
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-full border border-frame-strong bg-ink/60 text-paper backdrop-blur transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <ArrowOut />
          </span>
        </div>
      </div>

      {/* Mobile-only title row beneath the image — guarantees no clipping */}
      <div className="mt-3 sm:hidden">
        <div className="font-display text-[1.05rem] leading-tight text-paper">
          {frame.title}
        </div>
        <div className="mt-1 text-eyebrow-sm text-mist">
          {frame.location} · {frame.light}
        </div>
      </div>

      {/* EXIF metadata block — desktop only */}
      <dl className="mt-3 hidden md:grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-eyebrow-sm tabular-nums">
        <Row label="LOCATION" value={frame.location} />
        <Row label="LIGHT" value={frame.light} />
        <Row label="LENS" value={frame.lens} />
      </dl>
    </motion.button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-mist">{label}</dt>
      <dd className="text-paper">{value}</dd>
    </>
  );
}

function ArrowOut() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
      <path d="M2 9L9 2M9 2H4M9 2V7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
