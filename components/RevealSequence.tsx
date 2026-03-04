"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { BriefingData } from "@/lib/types";

interface RevealSequenceProps {
  data: BriefingData;
  onComplete: () => void;
}

function DecryptText({
  text,
  active,
  mono = false,
}: {
  text: string;
  active: boolean;
  mono?: boolean;
}) {
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) { setDisplayed(""); return; }

    const chars = text.split("");
    const resolved = new Array(chars.length).fill(false);
    const current = new Array(chars.length).fill(" ");

    chars.forEach((c, i) => {
      if (c === " " || c === "\n") {
        resolved[i] = true;
        current[i] = c;
      }
    });

    const interval = setInterval(() => {
      const firstUnresolved = resolved.indexOf(false);
      if (firstUnresolved === -1) {
        clearInterval(interval);
        return;
      }

      if (Math.random() < 0.3) {
        resolved[firstUnresolved] = true;
        current[firstUnresolved] = chars[firstUnresolved];
      }

      for (let i = 0; i < chars.length; i++) {
        if (!resolved[i]) {
          current[i] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayed(current.join(""));
    }, 35);

    return () => clearInterval(interval);
  }, [text, active]);

  return (
    <span className={mono ? "font-mono" : "font-sans"}>
      {active ? displayed || text : text}
    </span>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RevealSequence({
  data,
  onComplete,
}: RevealSequenceProps) {
  const [visibleSteps, setVisibleSteps] = useState<Set<string>>(new Set());
  const [skipped, setSkipped] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSkipped(true);
    }
  }, []);

  const formattedDate = formatDate(data.date);

  const earthquakeText = data.earthquake
    ? `The ground shook in ${data.earthquake.location} — magnitude ${data.earthquake.magnitude}. ${data.earthquake.distance_description}`
    : "The Earth held still — but your mind didn't.";

  const asteroidText = data.asteroid
    ? `Asteroid ${data.asteroid.name}, roughly the size of ${data.asteroid.size_comparison}, passed ${data.asteroid.distance_comparison} at ${data.asteroid.speed_mph} mph.`
    : null;

  const issText = data.iss
    ? `The International Space Station was over ${data.iss.location_name} — ${data.crew ? `Expedition ${data.crew.expedition}, crew of ${data.crew.crew_count}` : "orbiting at 17,500 mph"}.${data.crew ? ` ${data.crew.notable_member} was aboard.` : ""}`
    : "The ISS was out there somewhere at 17,500 mph — and so are you.";

  const stepIds = [
    "timestamp",
    "decision",
    "meanwhile",
    "static1",
    "earthquake",
    ...(asteroidText ? ["asteroid"] : []),
    "static2",
    "iss",
    "demographics",
    "significance",
    "closing",
  ];

  const baseDelay = 400;
  const stepDelay = 700;

  const fireComplete = useCallback(() => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onCompleteRef.current();
    }
  }, []);

  const handleSkip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setVisibleSteps(new Set(stepIds));
    setTimeout(fireComplete, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipped, fireComplete]);

  useEffect(() => {
    if (skipped && visibleSteps.size === 0) {
      setVisibleSteps(new Set(stepIds));
      const t = setTimeout(fireComplete, 600);
      return () => clearTimeout(t);
    }

    if (skipped) return;

    const timeouts: NodeJS.Timeout[] = [];
    stepIds.forEach((id, i) => {
      const t = setTimeout(() => {
        setVisibleSteps((prev) => new Set([...prev, id]));
      }, baseDelay + i * stepDelay);
      timeouts.push(t);
    });

    const completeTimeout = setTimeout(
      fireComplete,
      baseDelay + stepIds.length * stepDelay + 1200
    );
    timeouts.push(completeTimeout);

    timeoutsRef.current = timeouts;
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipped, fireComplete]);

  const isVisible = (id: string) => visibleSteps.has(id);

  return (
    <div
      className="w-full max-w-xl mx-auto py-8 cursor-pointer min-h-[60dvh] scanlines relative"
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleSkip()}
      aria-label="Click to skip animation"
    >
      <div className="space-y-6">
        {/* Timestamp */}
        <div
          className={`transition-all duration-500 ${
            isVisible("timestamp")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {isVisible("timestamp") && (
            <p className="font-mono text-[10px] text-fg-muted/40 uppercase tracking-[0.4em]">
              <DecryptText
                text={`Briefing initiated // ${formattedDate}`}
                active={isVisible("timestamp")}
                mono
              />
            </p>
          )}
        </div>

        {/* Decision */}
        <div
          className={`transition-all duration-500 ${
            isVisible("decision")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {isVisible("decision") && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] text-fg-muted/50 uppercase tracking-[0.3em]">
                While you were deciding
              </p>
              <h1 className="font-sans text-2xl md:text-3xl text-fg-heading font-bold leading-tight">
                <span className="text-accent">{data.decision}</span>
              </h1>
            </div>
          )}
        </div>

        {/* Meanwhile */}
        <div
          className={`transition-all duration-500 ${
            isVisible("meanwhile")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {isVisible("meanwhile") && (
            <p className="font-sans text-sm text-fg-muted/70 italic">
              {data.meanwhile_line}
            </p>
          )}
        </div>

        {/* Static burst 1 */}
        <div
          className={`transition-all duration-300 ${
            isVisible("static1")
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          {isVisible("static1") && (
            <div className="h-px w-full" style={{
              background: "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(78,204,163,0.15) 2px, rgba(78,204,163,0.15) 4px)",
            }} />
          )}
        </div>

        {/* Earthquake */}
        <div
          className={`transition-all duration-500 ${
            isVisible("earthquake")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {isVisible("earthquake") && (
            <div className="space-y-1.5">
              <p className="font-mono text-[10px] text-accent/50 uppercase tracking-[0.3em]">
                ◆ Seismic
              </p>
              <p className="font-sans text-base text-fg leading-relaxed pl-3 border-l border-accent/20">
                {earthquakeText}
              </p>
            </div>
          )}
        </div>

        {/* Asteroid */}
        {asteroidText && (
          <div
            className={`transition-all duration-500 ${
              isVisible("asteroid")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {isVisible("asteroid") && (
              <div className="space-y-1.5">
                <p className="font-mono text-[10px] text-accent/50 uppercase tracking-[0.3em]">
                  ◆ Near-earth object
                </p>
                <p className="font-sans text-base text-fg leading-relaxed pl-3 border-l border-accent/20">
                  {asteroidText}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Static burst 2 */}
        <div
          className={`transition-all duration-300 ${
            isVisible("static2")
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          {isVisible("static2") && (
            <div className="h-px w-full" style={{
              background: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(78,204,163,0.1) 3px, rgba(78,204,163,0.1) 5px)",
            }} />
          )}
        </div>

        {/* ISS */}
        <div
          className={`transition-all duration-500 ${
            isVisible("iss")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {isVisible("iss") && (
            <div className="space-y-1.5">
              <p className="font-mono text-[10px] text-accent/50 uppercase tracking-[0.3em]">
                ◆ Orbital
              </p>
              <p className="font-sans text-base text-fg leading-relaxed pl-3 border-l border-accent/20">
                {issText}
              </p>
            </div>
          )}
        </div>

        {/* Demographics */}
        <div
          className={`transition-all duration-500 ${
            isVisible("demographics")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {isVisible("demographics") && (
            <p className="font-sans text-sm text-fg-muted/60 pl-3 border-l border-border">
              {data.demographics.framed}
            </p>
          )}
        </div>

        {/* Significance */}
        <div
          className={`transition-all duration-700 ${
            isVisible("significance")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {isVisible("significance") && (
            <div className="text-center py-6 space-y-2">
              <p className="font-mono text-[10px] text-fg-muted/30 tracking-[0.3em] uppercase">
                Cosmic significance: 0.0000000%
              </p>
              <p className="font-sans text-2xl md:text-3xl text-fg-heading font-bold">
                To you: immeasurable.
              </p>
            </div>
          )}
        </div>

        {/* Closing */}
        <div
          className={`transition-all duration-700 ${
            isVisible("closing")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {isVisible("closing") && (
            <div className="pt-4 border-t border-accent/15">
              <p className="font-sans text-base text-fg-heading leading-relaxed">
                {data.closing_line}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Skip hint */}
      {!skipped && visibleSteps.size > 0 && visibleSteps.size < stepIds.length && (
        <p className="font-mono text-[9px] text-fg-muted/20 text-center pt-8 tracking-widest uppercase">
          tap to skip
        </p>
      )}
    </div>
  );
}
