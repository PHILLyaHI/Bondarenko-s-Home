"use client";

import { useEffect } from "react";

/**
 * Sets the mobile text-scale attribute on <html> for the duration of this route.
 * Paired with the CSS rules in `globals.css` that resize the root font when
 * data-text-scale is present (mobile only).
 *
 * On unmount we strip the attribute so navigation back to `/` resets to the
 * production baseline.
 */
export default function VariantBootstrap({ scale }: { scale: string }) {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute("data-text-scale");
    html.setAttribute("data-text-scale", scale);
    return () => {
      if (prev != null) html.setAttribute("data-text-scale", prev);
      else html.removeAttribute("data-text-scale");
    };
  }, [scale]);
  return null;
}
