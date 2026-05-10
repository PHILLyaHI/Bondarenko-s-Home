import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Grain from "./components/fx/grain";
import ViewfinderCursor from "./components/fx/viewfinder-cursor";
import SmoothScroll from "./components/fx/smooth-scroll";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Bondarenko Home Photography — Seattle Real Estate Photography",
  description:
    "Make your listing the one buyers click first. Cinematic real estate photography across the Puget Sound — interiors, exteriors, twilight, drone, video.",
  metadataBase: new URL("https://bondarenkohomephoto.com"),
  openGraph: {
    title: "Bondarenko Home Photography",
    description:
      "Real estate photography that gets homes sold faster across Seattle, Bellevue, and the Puget Sound.",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="bg-ink text-paper antialiased">
        <SmoothScroll />
        {children}
        <Grain />
        <ViewfinderCursor />
      </body>
    </html>
  );
}
