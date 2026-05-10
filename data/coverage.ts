export interface CoverageCity {
  name: string;
  /** Normalized x,y on a 100×100 grid for the SVG blueprint */
  x: number;
  y: number;
  /** "core" cities are visually emphasized */
  tier: "core" | "edge";
}

export const cities: CoverageCity[] = [
  { name: "Seattle", x: 28, y: 38, tier: "core" },
  { name: "Bellevue", x: 56, y: 44, tier: "core" },
  { name: "Kirkland", x: 54, y: 30, tier: "core" },
  { name: "Redmond", x: 68, y: 32, tier: "core" },
  { name: "Issaquah", x: 76, y: 56, tier: "edge" },
  { name: "Sammamish", x: 72, y: 44, tier: "edge" },
  { name: "Mercer Island", x: 44, y: 52, tier: "core" },
];

export const radius = "30 miles · King County";
