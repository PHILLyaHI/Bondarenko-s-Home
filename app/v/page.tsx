import Link from "next/link";
import { variants } from "./variants";

/**
 * Mobile text-scale variant index. Phone-only A/B page; open this on a
 * phone (or in a narrow Chrome window) to compare each scale at once.
 */
export default function VariantsIndex() {
  return (
    <main className="mx-auto min-h-screen max-w-[640px] px-5 py-16 text-paper">
      <div className="text-eyebrow text-sage">▶ MOBILE TEXT-SCALE VARIANTS</div>
      <h1 className="mt-4 font-display text-[2.2rem] leading-[1.05] tracking-[-0.02em]">
        <em className="not-italic [font-style:italic]">Pick a size.</em>{" "}
        <span className="text-mist">Compare the feel.</span>
      </h1>
      <p className="mt-5 max-w-[42ch] text-sm text-haze">
        Each variant ships the same page with a different mobile root font
        scale. Spacing, typography, and tap targets all inherit the multiplier
        — open them side by side and pick the one that breathes best on a
        real phone.
      </p>

      <ul className="mt-10 grid gap-3">
        {variants.map((v) => (
          <li key={v.slug}>
            <Link
              href={`/v/${v.slug}`}
              className="group flex items-center justify-between gap-4 rounded-[3px] border border-frame bg-graphite/40 px-5 py-4 transition-colors hover:border-frame-strong hover:bg-graphite/70"
            >
              <span className="flex flex-col gap-1">
                <span className="font-display text-[1.4rem] leading-none text-paper">
                  {v.label}
                </span>
                <span className="text-[0.62rem] tracking-[0.2em] uppercase text-mist">
                  {v.hint}
                </span>
              </span>
              <span
                aria-hidden
                className="inline-flex size-9 items-center justify-center rounded-full border border-frame-strong text-paper transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 text-[0.62rem] tracking-[0.22em] uppercase text-mist hover:text-paper"
          >
            ← BACK TO BASELINE (1.00×)
          </Link>
        </li>
      </ul>
    </main>
  );
}
