export interface PricingTier {
  code: "ESS" | "SIG" | "PRM";
  name: string;
  price: number;
  exposure: string; // shutter-speed style label
  tagline: string;
  delivery: string;
  squareFt: string;
  includes: string[];
  /** Visual gradient intensity 1–3 */
  intensity: 1 | 2 | 3;
}

export const tiers: PricingTier[] = [
  {
    code: "ESS",
    name: "Essential",
    price: 275,
    exposure: "1/250 · f/8",
    tagline: "Every-listing package.",
    delivery: "24-hour delivery",
    squareFt: "Up to 2,500 sq ft",
    includes: [
      "Up to 25 stills",
      "HDR-blended interiors + exterior",
      "Color-graded overnight",
      "Zillow / MLS-ready gallery link",
    ],
    intensity: 1,
  },
  {
    code: "SIG",
    name: "Signature",
    price: 475,
    exposure: "1/15 · f/5.6",
    tagline: "Twilight included. The one realtors call back for.",
    delivery: "Next-day delivery",
    squareFt: "Up to 4,000 sq ft",
    includes: [
      "40 stills",
      "Twilight exterior, the signature shot",
      "Aerial drone (FAA Part 107)",
      "Color-graded overnight",
      "Premium gallery link",
    ],
    intensity: 3,
  },
  {
    code: "PRM",
    name: "Premium",
    price: 750,
    exposure: "Bulb · f/2.8",
    tagline: "For the listings that need to feel like a film.",
    delivery: "Next-day stills · 48 hr video",
    squareFt: "No size cap",
    includes: [
      "Everything in Signature",
      "60 to 90 sec video walkthrough",
      "Matterport 3D tour",
      "2D floor plan with dimensions",
      "Vertical Reel cut",
    ],
    intensity: 2,
  },
];
