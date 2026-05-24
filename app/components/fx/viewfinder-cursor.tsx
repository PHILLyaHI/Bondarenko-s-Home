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

    // The site sets `zoom: 0.9` on <html> at the md+ breakpoint to make the
    // page render as if at 90% browser zoom. Chrome reports pointer-event
    // clientX/Y in the zoom-deflated coordinate space, so a fixed element
    // positioned by clientX renders OFFSET by the zoom factor. We read the
    // computed zoom and divide pointer coords by it so the cursor follows
    // the real pointer at every variant. Falls back to 1 when unsupported.
    const readZoom = (): number => {
      const z = parseFloat(
        getComputedStyle(document.documentElement).zoom || "1"
      );
      return Number.isFinite(z) && z > 0 ? z : 1;
    };
    let zoom = readZoom();

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / zoom;
      ty = e.clientY / zoom;
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button, [data-cursor='frame']");
      setActive(!!interactive);
    };
    const onResize = () => {
      zoom = readZoom();
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
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("resize", onResize);
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
