"use client";

import type { BriefingData } from "@/lib/types";

interface MissionCardProps {
  data: BriefingData;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MissionCard({ data }: MissionCardProps) {
  const formattedDate = formatDate(data.date);
  const briefingNum = String(data.briefing_number).padStart(7, "0");

  return (
    <div className="w-full max-w-xl mx-auto relative">
      {/* Card container with textures */}
      <div className="bg-bg-surface border border-border relative overflow-hidden noise-overlay vignette paper-fold">
        {/* Classification bar */}
        <div className="bg-accent-amber/8 border-b border-accent-amber/20 px-5 py-2 flex items-center justify-between">
          <p className="font-mono text-[9px] text-accent-amber/70 uppercase tracking-[0.4em]">
            Classified Briefing
          </p>
          <p className="font-mono text-[9px] text-accent-amber/40">
            #{briefingNum}
          </p>
        </div>

        <div className="relative z-10 p-5 md:p-7 space-y-5">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <p className="font-mono text-[10px] text-fg-muted/40 tracking-[0.3em] uppercase">
                Mission Log // {formattedDate}
              </p>
            </div>
            {/* DECIDED stamp */}
            <div
              className="font-mono text-sm text-accent-warn/70 border-2 border-accent-warn/40 px-3 py-1 uppercase tracking-[0.25em] font-bold"
              style={{
                transform: "rotate(-6deg)",
                animation: "stamp-press 0.5s ease-out both",
                textShadow: "0 0 8px rgba(217, 79, 61, 0.2)",
                boxShadow: "inset 0 0 12px rgba(217, 79, 61, 0.08)",
              }}
            >
              Decided
            </div>
          </div>

          {/* Decision - Hero */}
          <div className="py-1">
            <p className="font-mono text-[10px] text-fg-muted/40 uppercase tracking-[0.3em] mb-2">
              While you were deciding
            </p>
            <h2 className="font-sans text-xl md:text-2xl text-fg-heading font-bold leading-tight">
              {data.decision}
            </h2>
          </div>

          {/* Data points with left-border accent */}
          <div className="space-y-3">
            {data.earthquake && (
              <div className="pl-3 border-l-2 border-accent/20">
                <p className="font-mono text-[9px] text-accent/40 uppercase tracking-[0.25em] mb-0.5">
                  Seismic
                </p>
                <p className="font-sans text-sm text-fg leading-relaxed">
                  The ground shook in {data.earthquake.location} (M
                  {data.earthquake.magnitude})
                </p>
              </div>
            )}

            {data.asteroid && (
              <div className="pl-3 border-l-2 border-accent/20">
                <p className="font-mono text-[9px] text-accent/40 uppercase tracking-[0.25em] mb-0.5">
                  Near-earth
                </p>
                <p className="font-sans text-sm text-fg leading-relaxed">
                  Asteroid {data.asteroid.name} slipped past (
                  {data.asteroid.distance_comparison})
                </p>
              </div>
            )}

            {data.iss && (
              <div className="pl-3 border-l-2 border-accent/20">
                <p className="font-mono text-[9px] text-accent/40 uppercase tracking-[0.25em] mb-0.5">
                  Orbital
                </p>
                <p className="font-sans text-sm text-fg leading-relaxed">
                  The ISS passed over {data.iss.location_name}
                  {data.crew && (
                    <span className="text-fg-muted">
                      {" "}— Exp. {data.crew.expedition}, crew of{" "}
                      {data.crew.crew_count}
                    </span>
                  )}
                </p>
              </div>
            )}

            {data.wikipedia.length > 0 && (
              <div className="pl-3 border-l-2 border-border">
                <p className="font-mono text-[9px] text-fg-muted/40 uppercase tracking-[0.25em] mb-0.5">
                  World
                </p>
                <p className="font-sans text-sm text-fg leading-relaxed">
                  {data.wikipedia[0].text.length > 120
                    ? data.wikipedia[0].text.slice(0, 117) + "..."
                    : data.wikipedia[0].text}
                </p>
              </div>
            )}

            <p className="font-sans text-xs text-fg-muted/50 pl-3">
              {data.demographics.framed}
            </p>
          </div>

          {/* Redacted bars for texture */}
          <div className="flex gap-2 items-center">
            <span className="redacted">REDACTED</span>
            <span className="redacted">CLASSIFIED</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Significance */}
          <div className="text-center py-3 space-y-1">
            <p className="font-mono text-[10px] text-fg-muted/25 tracking-[0.2em]">
              Cosmic significance: 0.0000000%
            </p>
            <p className="font-sans text-xl text-fg-heading font-bold">
              To you: immeasurable.
            </p>
          </div>

          {/* Closing */}
          <div className="pt-3 border-t border-accent/10">
            <p className="font-sans text-sm text-fg leading-relaxed">
              {data.closing_line}
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end pt-1">
            <p className="font-mono text-[8px] text-fg-muted/20 tracking-wider">
              whileyouweredeciding.com
            </p>
            <p className="font-mono text-[8px] text-fg-muted/15">
              #{briefingNum}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
