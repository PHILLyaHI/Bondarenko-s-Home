"use client";

import { useEffect, useRef, useState } from "react";

export default function ViewfinderCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button, [data-cursor='frame']");
      setActive(!!interactive);
    };

    function tick() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  if (!enabled) return null;

  const size = active ? 56 : 24;
  const stroke = active ? "rgba(250,247,242,0.95)" : "rgba(250,247,242,0.5)";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden lg:block"
      style={{ transition: "none" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          transition:
            "width 220ms cubic-bezier(0.22,1,0.36,1), height 220ms cubic-bezier(0.22,1,0.36,1)",
          overflow: "visible",
        }}
      >
        {/* Four corner brackets (viewfinder marks) */}
        <g fill="none" stroke={stroke} strokeWidth={active ? 1.4 : 2}>
          <path d="M 0 14 L 0 0 L 14 0" />
          <path d="M 86 0 L 100 0 L 100 14" />
          <path d="M 100 86 L 100 100 L 86 100" />
          <path d="M 14 100 L 0 100 L 0 86" />
        </g>
        {active && (
          <circle cx="50" cy="50" r="1.4" fill="rgba(250,247,242,0.9)" />
        )}
      </svg>
    </div>
  );
}
