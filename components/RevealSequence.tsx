"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { BriefingData } from "@/lib/types";

interface RevealSequenceProps {
  data: BriefingData;
  onComplete: () => void;
}

interface RevealStep {
  id: string;
  content: React.ReactNode;
  delay: number; // ms from start
}

function TypewriterText({
  text,
  speed = 40,
  onDone,
  skip,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
  skip: boolean;
}) {
  const [displayed, setDisplayed] = useState(skip ? text : "");
  const indexRef = useRef(0);

  useEffect(() => {
    if (skip) {
      setDisplayed(text);
      onDone?.();
      return;
    }
    indexRef.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, skip, onDone]);

  return <>{displayed}</>;
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
  const [typewriterDone, setTypewriterDone] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion.current) {
      setSkipped(true);
    }
  }, []);

  // Build the content blocks
  const formattedDate = formatDate(data.date);

  const earthquakeText = data.earthquake
    ? `The ground shook in ${data.earthquake.location} — magnitude ${data.earthquake.magnitude}. ${data.earthquake.distance_description}`
    : "The Earth held still — but your mind didn't.";

  const asteroidText = data.asteroid
    ? `Asteroid ${data.asteroid.name}, roughly the size of ${data.asteroid.size_comparison}, passed ${data.asteroid.distance_comparison} at ${data.asteroid.speed_mph} mph.`
    : null;

  const issText = data.iss
    ? `The International Space Station was ${data.iss.location_name} — ${data.crew ? `Expedition ${data.crew.expedition}, crew of ${data.crew.crew_count}` : "orbiting at 17,500 mph"}.${data.crew ? ` ${data.crew.notable_member} was aboard.` : ""}`
    : "The ISS was out there somewhere at 17,500 mph — and so are you.";

  const steps: RevealStep[] = [
    {
      id: "timestamp",
      delay: 300,
      content: (
        <p className="font-mono text-xs text-fg-muted tracking-widest uppercase">
          <TypewriterText
            text={`Briefing initiated // ${formattedDate}`}
            speed={30}
            skip={skipped}
          />
        </p>
      ),
    },
    {
      id: "decision",
      delay: 800,
      content: (
        <h1 className="font-sans text-2xl md:text-3xl text-fg-heading font-semibold leading-tight">
          While you were deciding
          <br />
          <span className="text-accent">
            <TypewriterText
              text={`${data.decision}...`}
              speed={40}
              onDone={() => setTypewriterDone(true)}
              skip={skipped}
            />
          </span>
        </h1>
      ),
    },
    {
      id: "meanwhile",
      delay: 1500,
      content: (
        <p className="font-sans text-sm text-fg-muted italic">
          {data.meanwhile_line}
        </p>
      ),
    },
    {
      id: "earthquake",
      delay: 2100,
      content: (
        <p className="font-sans text-base text-fg leading-relaxed">
          {earthquakeText}
        </p>
      ),
    },
    ...(asteroidText
      ? [
          {
            id: "asteroid",
            delay: 2800,
            content: (
              <p className="font-sans text-base text-fg leading-relaxed">
                {asteroidText}
              </p>
            ),
          },
        ]
      : []),
    {
      id: "iss",
      delay: asteroidText ? 3500 : 2800,
      content: (
        <p className="font-sans text-base text-fg leading-relaxed">{issText}</p>
      ),
    },
    {
      id: "demographics",
      delay: asteroidText ? 3900 : 3200,
      content: (
        <p className="font-sans text-sm text-fg-muted">
          {data.demographics.framed}
        </p>
      ),
    },
    {
      id: "significance",
      delay: asteroidText ? 4200 : 3500,
      content: (
        <div className="space-y-1">
          <p className="font-mono text-xs text-fg-muted/60">
            Cosmic significance: 0.0000000%
          </p>
          <p className="font-sans text-lg text-fg-heading font-medium">
            To you: immeasurable.
          </p>
        </div>
      ),
    },
    {
      id: "closing",
      delay: asteroidText ? 5000 : 4300,
      content: (
        <p className="font-sans text-base text-fg-heading leading-relaxed pt-4 border-t border-border">
          {data.closing_line}
        </p>
      ),
    },
  ];

  const handleSkip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setVisibleSteps(new Set(steps.map((s) => s.id)));
    onComplete();
  }, [skipped, steps, onComplete]);

  useEffect(() => {
    if (skipped) {
      setVisibleSteps(new Set(steps.map((s) => s.id)));
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }

    // Choreograph the reveal
    const timeouts: NodeJS.Timeout[] = [];
    for (const step of steps) {
      const t = setTimeout(() => {
        setVisibleSteps((prev) => new Set([...prev, step.id]));
      }, step.delay);
      timeouts.push(t);
    }

    // Mark complete after last step + buffer
    const lastDelay = steps[steps.length - 1].delay;
    const completeTimeout = setTimeout(onComplete, lastDelay + 1000);
    timeouts.push(completeTimeout);

    timeoutsRef.current = timeouts;
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipped]);

  return (
    <div
      className="w-full max-w-lg mx-auto space-y-6 py-8 cursor-pointer min-h-[60dvh]"
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleSkip()}
      aria-label="Click to skip animation"
    >
      {steps.map((step) => (
        <div
          key={step.id}
          className={`transition-all duration-500 ${
            visibleSteps.has(step.id)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {visibleSteps.has(step.id) && step.content}
        </div>
      ))}

      {!skipped && visibleSteps.size > 0 && visibleSteps.size < steps.length && (
        <p className="font-mono text-[10px] text-fg-muted/30 text-center pt-4 animate-pulse">
          tap to skip
        </p>
      )}
    </div>
  );
}
