import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const bodyFont = Lato({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Holiday Planner",
  description: "Plan Your Dream Vacation Around This Year's Holidays!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23ffffff%22></rect><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2290%22>🌴</text></svg>"
        />
      </head>
      <body className={bodyFont.className}>{children}</body>
    </html>
  );
}
