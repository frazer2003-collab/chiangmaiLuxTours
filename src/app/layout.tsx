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
    "Licensed Mekong slow boat tours on the Huay Xai ↔ Luang Prabang corridor. Browse routes and book online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${chart.variable} ${ui.variable} h-full`}>
      <body className="min-h-full antialiased">
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
