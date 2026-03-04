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
    <div className="w-full max-w-lg mx-auto bg-bg-surface border border-border p-6 md:p-8 space-y-5 relative overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,214,229,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,214,229,0.5) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-mono text-[10px] text-fg-muted tracking-widest uppercase">
              Mission Log // {formattedDate}
            </p>
            <p className="font-mono text-[10px] text-fg-muted/50">
              Briefing #{briefingNum}
            </p>
          </div>
          <div
            className="font-mono text-[10px] text-accent-warn/80 border border-accent-warn/30 px-2 py-0.5 uppercase tracking-widest"
            style={{ transform: "rotate(-2deg)" }}
          >
            Decided
          </div>
        </div>

        {/* Decision - Hero text */}
        <div className="py-2">
          <p className="font-mono text-[10px] text-fg-muted/60 uppercase tracking-widest mb-1">
            While you were deciding
          </p>
          <h2 className="font-sans text-xl md:text-2xl text-fg-heading font-semibold leading-tight">
            {data.decision}
          </h2>
        </div>

        {/* Data points */}
        <div className="space-y-3 text-sm text-fg">
          {data.earthquake && (
            <p>
              <span className="text-fg-muted font-mono text-[10px] uppercase tracking-wider">
                Earth:{" "}
              </span>
              the ground shook in {data.earthquake.location} (M
              {data.earthquake.magnitude})
            </p>
          )}

          {data.asteroid && (
            <p>
              <span className="text-fg-muted font-mono text-[10px] uppercase tracking-wider">
                Space:{" "}
              </span>
              asteroid {data.asteroid.name} slipped past (
              {data.asteroid.distance_comparison})
            </p>
          )}

          {data.iss && (
            <p>
              <span className="text-fg-muted font-mono text-[10px] uppercase tracking-wider">
                Orbit:{" "}
              </span>
              the ISS passed {data.iss.location_name}
              {data.crew && (
                <span className="text-fg-muted">
                  {" "}
                  — Exp. {data.crew.expedition}, crew of {data.crew.crew_count}
                </span>
              )}
            </p>
          )}

          {data.wikipedia.length > 0 && (
            <p>
              <span className="text-fg-muted font-mono text-[10px] uppercase tracking-wider">
                World:{" "}
              </span>
              {data.wikipedia[0].text.length > 120
                ? data.wikipedia[0].text.slice(0, 117) + "..."
                : data.wikipedia[0].text}
            </p>
          )}

          <p className="text-fg-muted text-xs">{data.demographics.framed}</p>
        </div>

        {/* Significance */}
        <div className="pt-2 space-y-0.5">
          <p className="font-mono text-[10px] text-fg-muted/40">
            Cosmic significance: 0.0000000%
          </p>
          <p className="font-sans text-base text-fg-heading">
            To you: immeasurable.
          </p>
        </div>

        {/* Closing */}
        <div className="pt-3 border-t border-border space-y-3">
          <p className="font-sans text-sm text-fg leading-relaxed">
            {data.closing_line}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end pt-2">
          <p className="font-mono text-[9px] text-fg-muted/30">
            whileyouweredeciding.com
          </p>
        </div>
      </div>
    </div>
  );
}
