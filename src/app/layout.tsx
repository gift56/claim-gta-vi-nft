import type { Metadata, Viewport } from "next";
import { Fugaz_One, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

// Display font stand-in for Pricedown (not on Google Fonts).
// To swap in the real Pricedown: add licensed files to src/app/fonts/ and
// replace Fugaz_One with next/font/local exposing the same --font-display
// variable. No token or component changes are required.
const fugaz = Fugaz_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fugaz",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "GTA VI Character NFT Claim",
  description:
    "Inspect and claim GTA VI-inspired character NFTs on Ethereum Sepolia.",
};

export const viewport: Viewport = {
  themeColor: "#0D132B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fugaz.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-night font-sans text-ink">{children}</body>
    </html>
  );
}
