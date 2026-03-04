import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ hash: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hash } = await params;
  return {
    title: "While You Were Deciding",
    description:
      "Someone got their briefing. See what the universe was doing when you made your biggest decision.",
    openGraph: {
      title: "While You Were Deciding",
      description:
        "Someone got their briefing. See what the universe was doing when you made your biggest decision.",
      images: [`/api/og/${hash}`],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "While You Were Deciding",
      description: "Someone got their briefing. Get yours.",
      images: [`/api/og/${hash}`],
    },
  };
}

export default async function SharedBriefingPage({ params }: Props) {
  const { hash } = await params;

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 text-center space-y-8">
      <div className="space-y-3">
        <p className="font-mono text-xs text-fg-muted tracking-widest uppercase">
          Briefing #{hash.slice(0, 7)}
        </p>
        <h1 className="font-sans text-2xl md:text-3xl text-fg-heading font-semibold">
          Someone got their briefing.
        </h1>
        <p className="font-sans text-base text-fg-muted max-w-sm mx-auto">
          The universe was busy that day. So were they. Now it&apos;s your turn.
        </p>
      </div>

      <Link
        href="/"
        className="font-mono text-sm uppercase tracking-[0.3em] text-accent border border-accent px-8 py-4 hover:bg-accent/10 transition-colors"
      >
        Get your briefing
      </Link>

      <p className="font-mono text-[10px] text-fg-muted/30">
        No account needed. Nothing is stored.
      </p>
    </main>
  );
}
