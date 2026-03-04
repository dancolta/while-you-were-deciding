import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "While You Were Deciding",
  description:
    "The universe was busy. You decided anyway. That's the whole story.",
  openGraph: {
    title: "While You Were Deciding",
    description:
      "See what the universe was doing when you made your biggest decision.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "While You Were Deciding",
    description:
      "See what the universe was doing when you made your biggest decision.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plexMono.variable} ${plexSans.variable} antialiased bg-bg text-fg font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
