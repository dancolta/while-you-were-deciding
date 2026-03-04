import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <p className="font-mono text-xs text-fg-muted tracking-widest uppercase">
        Briefing not found
      </p>
      <h1 className="font-sans text-2xl text-fg-heading font-semibold">
        This file may have been redacted.
      </h1>
      <p className="font-sans text-sm text-fg-muted max-w-sm">
        This page doesn&apos;t exist. Most of the universe is empty space, and
        it&apos;s doing great.
      </p>
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[0.2em] text-accent border border-accent px-6 py-3 hover:bg-accent/10 transition-colors"
      >
        Start a new briefing
      </Link>
    </main>
  );
}
