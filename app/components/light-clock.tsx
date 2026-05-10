"use client";

import { useEffect, useState } from "react";
import { getLightConditionAt, fmtClock, type LightInfo } from "@/lib/light-hours";

export default function LightClock({
  compact = false,
  compactMobile = false,
}: {
  compact?: boolean;
  /** When true, the badge sizes down at <md (smaller font, tighter padding, narrower max-width). Desktop unchanged. */
  compactMobile?: boolean;
}) {
  const [info, setInfo] = useState<LightInfo | null>(null);
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setInfo(getLightConditionAt(d));
      setNow(fmtClock(d));
    };
    update();
    const id = setInterval(update, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!info) {
    // Render nothing pre-hydration; avoids server/client time mismatch.
    return (
      <div className={compact ? "" : "h-[64px]"} aria-hidden="true" />
    );
  }

  return (
    <div
      className={
        "border border-frame bg-graphite/55 backdrop-blur-md tabular-nums select-none rounded-none " +
        (compactMobile
          // Mobile: smaller font + tighter padding + narrower footprint. Desktop: identical to default.
          ? "px-2 py-1 text-[0.55rem] tracking-[0.18em] max-w-[14rem] md:max-w-none md:px-3 md:py-2 md:text-eyebrow-sm md:tracking-[0.18em] "
          : "px-3 py-2 text-eyebrow-sm ")
      }
      aria-label={`Current light condition: ${info.label} at ${now} Seattle time. Next: ${info.nextLabel} at ${info.nextAt}.`}
    >
      <div className="flex items-center gap-1.5 text-mist md:gap-2">
        <span
          aria-hidden
          className="block size-[6px] rounded-full"
          style={{
            background: info.color,
            boxShadow: `0 0 12px ${info.color}`,
            animation: "pulse 2.4s ease-in-out infinite",
          }}
        />
        <span>SEATTLE · LIGHT</span>
      </div>
      {/* Mobile: condition + time + next-light all on one line, dot-separated. Desktop: split as before. */}
      <div className="mt-[6px] flex flex-wrap items-baseline gap-x-2 text-paper sm:flex-nowrap sm:gap-2">
        <span className="font-medium">{info.label}</span>
        <span className="text-mist">{now}</span>
        {!compact && (
          <span className="text-mist sm:hidden">· NEXT {info.nextLabel} {info.nextAt}</span>
        )}
      </div>
      {!compact && (
        <div className="mt-[2px] hidden text-mist sm:block">
          NEXT · {info.nextLabel} · {info.nextAt}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
