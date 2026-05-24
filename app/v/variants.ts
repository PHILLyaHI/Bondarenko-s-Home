/**
 * Mobile text-scale A/B variants. Each variant slug maps to a multiplier
 * applied to the root font-size on phones via `globals.css`. The page
 * layout, components, and copy are otherwise identical so the only thing
 * being tested is the global text/spacing scale.
 *
 * Pick a variant by visiting `/v/<slug>` on a phone. The /v index links
 * to every variant side by side so they can be compared from one place.
 */

export const variants = [
  { slug: "xs", label: "XS · 0.92×",      hint: "compact"              },
  { slug: "sm", label: "SM · 0.96×",      hint: "slight downshift"     },
  { slug: "md", label: "MD · 1.04×",      hint: "slight bump"          },
  { slug: "lg", label: "LG · 1.10×",      hint: "comfortable"          },
  { slug: "xl", label: "XL · 1.16×",      hint: "loud"                 },
] as const;

export type VariantSlug = (typeof variants)[number]["slug"];

export const variantSlugs = variants.map((v) => v.slug) as readonly VariantSlug[];

export function isVariantSlug(s: string): s is VariantSlug {
  return (variantSlugs as readonly string[]).includes(s);
}
