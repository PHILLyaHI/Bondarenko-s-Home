export interface Testimonial {
  quote: string;
  who: string;
  brokerage: string;
  detail: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "Sold in 4 days, 18% over asking. The twilight shot got 3x the saves on Zillow.",
    who: "Priya N.",
    brokerage: "Windermere",
    detail: "Sold in 4 days",
  },
  {
    quote: "I've worked with five photographers in Bellevue. Ben is the only one I call now.",
    who: "David K.",
    brokerage: "Compass",
    detail: "Five photographers, one call",
  },
  {
    quote: "His photos make my listings look like architecture magazine spreads.",
    who: "Elena R.",
    brokerage: "John L. Scott",
    detail: "Magazine-grade",
  },
];
