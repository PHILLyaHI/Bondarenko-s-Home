export interface Service {
  code: string;
  name: string;
  blurb: string;
  /** Light hour the service most lives in — drives card tint */
  light: "DAYLIGHT" | "GOLDEN" | "TWILIGHT" | "BLUE-HOUR" | "INTERIOR";
}

export const services: Service[] = [
  {
    code: "INT",
    name: "Interior",
    blurb: "HDR-blended, color-accurate. Reads at any scale.",
    light: "DAYLIGHT",
  },
  {
    code: "EXT",
    name: "Exterior",
    blurb: "Daylight or golden hour. Color-graded, never AI-flat.",
    light: "GOLDEN",
  },
  {
    code: "TWI",
    name: "Twilight",
    blurb: "The signature. Dusk exterior with warm interior glow.",
    light: "TWILIGHT",
  },
  {
    code: "AIR",
    name: "Aerial Drone",
    blurb: "FAA Part 107 certified. Lot, roofline, neighborhood at altitude.",
    light: "DAYLIGHT",
  },
  {
    code: "3D",
    name: "Matterport 3D Tour",
    blurb: "Full walk-through with measurement-grade dollhouse view.",
    light: "INTERIOR",
  },
  {
    code: "FP",
    name: "2D Floor Plan",
    blurb: "Clean, drawn-overnight floor plans with dimensions.",
    light: "DAYLIGHT",
  },
  {
    code: "VID",
    name: "Cinematic Video",
    blurb: "60 to 90 seconds, cut for Reels and the listing carousel.",
    light: "TWILIGHT",
  },
  {
    code: "RUSH",
    name: "Same-Day Rush",
    blurb: "Shot at sunrise, in your gallery by close of business.",
    light: "BLUE-HOUR",
  },
];
