import type { Metadata } from "next";
import { Libre_Baskerville, Libre_Franklin } from "next/font/google";
import "./globals.css";

const chart = Libre_Baskerville({
  variable: "--font-chart",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ui = Libre_Franklin({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mekong Transfer | Book Mekong Slow Boat Tours",
  description:
    "Licensed Mekong tours from Chiang Mai, Chiang Rai, Chiang Khong, and Huay Xai to Luang Prabang. Browse routes and book online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${chart.variable} ${ui.variable} h-full`}>
      <body className="min-h-full antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--marker-yellow)] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)]"
        >
          Skip to main content
        </a>
        {/*
          THESIS: Mekong journeys read as navigable river charts—waypoints, not generic tour cards.
          OWN-WORLD: cream chart paper, blue hydrography, yellow fix markers, serif route labels.
          STORY: Pick a river route, inspect the leg, book passage with licensed confidence.
          FIRST VIEWPORT: river hero under navy, licence strip, yellow Choose route CTA.
          FORM: River navigation chart (candidate 3, seed e2a74a72).
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        {children}
      </body>
    </html>
  );
}
