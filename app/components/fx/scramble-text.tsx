"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "▓▒░!?*<>/\\@%#$&|=+-_:;.,";

interface ScrambleTextProps {
  text: string;
  /** Total decode duration (ms) */
  duration?: number;
  className?: string;
  /** Replay decode on viewport entry */
  replayOnEnter?: boolean;
}

export default function ScrambleText({
  text,
  duration = 700,
  className = "",
  replayOnEnter = true,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [output, setOutput] = useState(scramble(text));
  const playedRef = useRef(false);

  useEffect(() => {
    if (!replayOnEnter) {
      decode(text, duration, setOutput);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            decode(text, duration, setOutput);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [text, duration, replayOnEnter]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {output}
    </span>
  );
}

function scramble(text: string): string {
  return text
    .split("")
    .map((c) => (c === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
    .join("");
}

function decode(
  target: string,
  duration: number,
  set: (s: string) => void
): void {
  const total = target.length;
  const start = performance.now();
  let raf = 0;

  function tick(now: number) {
    const t = Math.min(1, (now - start) / duration);
    const revealed = Math.floor(t * total);
    let out = "";
    for (let i = 0; i < total; i++) {
      if (i < revealed || target[i] === " ") {
        out += target[i];
      } else {
        out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
    }
    set(out);
    if (t < 1) raf = requestAnimationFrame(tick);
    else set(target);
  }

  raf = requestAnimationFrame(tick);
  return;
}
