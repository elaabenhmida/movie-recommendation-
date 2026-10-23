import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Flix.",
  description:
    "Discover your next favorite movie with Flix. Explore a curated collection of films, from timeless classics to hidden gems. Dive into detailed synopses, cast information, and personalized recommendations. Your cinematic journey starts here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} ${outfit.variable} selection:text-blue-900 selection:bg-blue-200`}
      >
        {children}
      </body>
    </html>
  );
}
