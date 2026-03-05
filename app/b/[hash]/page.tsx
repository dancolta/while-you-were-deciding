import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ hash: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hash } = await params;
  return {
    title: "On This Day",
    description:
      "Someone looked up a date. The universe was busy. Now it's your turn.",
    openGraph: {
      title: "On This Day",
      description:
        "Someone looked up a date. The universe was busy. Now it's your turn.",
      images: [`/api/og/${hash}`],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "On This Day",
      description:
        "Someone looked up a date. The universe was busy. Now it's your turn.",
      images: [`/api/og/${hash}`],
    },
  };
}

export default async function SharedBriefingPage({ params }: Props) {
  const _resolved = await params;

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 text-center space-y-8">
      <div className="space-y-4">
        {/* Brand header */}
        <div className="flex flex-col items-center">
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{
              fontFamily: "monospace",
              color: "#C45D20",
            }}
          >
            ON THIS
          </span>
          <span
            className="text-4xl md:text-5xl font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--fg-heading, #0F1720)",
            }}
          >
            DAY<span style={{ color: "#C45D20" }}>.</span>
          </span>
        </div>

        <h1
          className="text-2xl md:text-3xl font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--fg-heading, #0F1720)",
          }}
        >
          Someone looked up a date.
        </h1>
        <p
          className="text-base max-w-sm mx-auto"
          style={{
            color: "var(--fg-muted, #6B7280)",
          }}
        >
          The universe was busy. Now it&apos;s your turn.
        </p>
      </div>

      <Link
        href="/"
        className="text-sm uppercase tracking-[0.15em] font-semibold px-8 py-4 rounded-lg transition-opacity hover:opacity-90"
        style={{
          backgroundColor: "#C45D20",
          color: "#ffffff",
        }}
      >
        EXPLORE A DATE
      </Link>

      <p className="text-xs" style={{ color: "var(--fg-muted, #6B7280)", opacity: 0.5 }}>
        No account needed. Nothing is stored.
      </p>
    </main>
  );
}
