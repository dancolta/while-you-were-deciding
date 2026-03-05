import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "On This Day",
  description: "Enter a date. See what the universe was doing.",
  openGraph: {
    title: "On This Day",
    description: "Enter a date. See what the universe was doing.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "On This Day",
    description: "Enter a date. See what the universe was doing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plexMono.variable} ${plexSans.variable} ${fraunces.variable} antialiased bg-bg text-fg font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
