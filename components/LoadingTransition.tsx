"use client";

import { useState, useEffect } from "react";

interface LoadingTransitionProps {
  date: string;
  onReady: () => void;
}

const STEPS = [
  {
    text: "Checking seismic activity...",
    svg: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M2,10 L6,10 L8,3 L10,17 L12,7 L14,13 L16,10 L18,10"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    text: "Scanning for nearby asteroids...",
    svg: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <ellipse
          cx="10"
          cy="10"
          rx="8"
          ry="4"
          stroke="var(--accent)"
          strokeWidth="1.5"
          transform="rotate(-20 10 10)"
        />
        <circle cx="15.5" cy="7" r="1.5" fill="var(--accent)" />
      </svg>
    ),
  },
  {
    text: "Locating the Space Station...",
    svg: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="7"
          y="7"
          width="6"
          height="6"
          rx="1"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        <line x1="3" y1="10" x2="7" y2="10" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="10" x2="17" y2="10" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    text: "Looking up world events...",
    svg: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="3"
          y="4"
          width="14"
          height="13"
          rx="2"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        <line x1="3" y1="8" x2="17" y2="8" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="6" y1="11.5" x2="14" y2="11.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="14" x2="11" y2="14" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    text: "Counting births and deaths...",
    svg: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="7" cy="6" r="2" stroke="var(--accent)" strokeWidth="1.5" />
        <path d="M3,15 a4,4 0 0,1 8,0" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="13" cy="6" r="2" stroke="var(--accent)" strokeWidth="1.5" />
        <path d="M9,15 a4,4 0 0,1 8,0" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    text: "Checking the sun...",
    svg: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="4" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="10" y1="2" x2="10" y2="4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="16" x2="10" y2="18" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="10" x2="4" y2="10" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="10" x2="18" y2="10" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4.3" y1="4.3" x2="5.7" y2="5.7" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14.3" y1="14.3" x2="15.7" y2="15.7" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15.7" y1="4.3" x2="14.3" y2="5.7" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5.7" y1="14.3" x2="4.3" y2="15.7" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    text: "Finding fun facts...",
    svg: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="8" r="6" stroke="var(--accent)" strokeWidth="1.5" />
        <path d="M8 14v2a2 2 0 004 0v-2" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="5" x2="10" y2="9" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="11" r="0.5" fill="var(--accent)" />
      </svg>
    ),
  },
];

const TOTAL_DURATION = STEPS.length * 500 + 300;

export default function LoadingTransition({ date, onReady }: LoadingTransitionProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const formattedDate = (() => {
    const d = new Date(date + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  })();

  useEffect(() => {
    const stepDuration = 500;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < STEPS.length; i++) {
      timers.push(
        setTimeout(() => setCurrentStep(i + 1), i * stepDuration)
      );
    }

    timers.push(
      setTimeout(() => onReady(), STEPS.length * stepDuration + 300)
    );

    return () => timers.forEach(clearTimeout);
  }, [onReady]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <div className="text-center px-6 max-w-md w-full">
        {/* Date heading */}
        <h2
          className="font-bold text-2xl md:text-3xl mb-2"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--fg-heading)",
            animation: "loadingReveal 500ms cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {formattedDate}
        </h2>
        <p
          className="text-base font-medium mb-10"
          style={{
            color: "var(--fg-muted)",
            animation: "loadingReveal 500ms cubic-bezier(0.16, 1, 0.3, 1) 150ms both",
          }}
        >
          What was the world doing?
        </p>

        {/* Steps list */}
        <div className="space-y-3 text-left mx-auto" style={{ maxWidth: "280px" }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3"
              style={{
                opacity: currentStep > i ? 1 : 0.15,
                transform: currentStep > i ? "translateX(0)" : "translateX(-8px)",
                transition: "all 350ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="shrink-0 flex items-center justify-center" style={{ width: "24px" }}>
                {step.svg}
              </span>
              <span
                className="text-sm font-medium"
                style={{
                  color: currentStep > i ? "var(--fg)" : "var(--fg-muted)",
                }}
              >
                {step.text}
              </span>
              {currentStep > i && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  className="ml-auto shrink-0"
                  style={{ animation: "springPop 200ms cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
                >
                  <circle cx="7" cy="7" r="7" fill="var(--accent)" opacity={0.15} />
                  <path
                    d="M4 7l2 2 4-4"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-10 mx-auto" style={{ maxWidth: "200px" }}>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{
              height: "4px",
              backgroundColor: "var(--border)",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: "var(--accent)",
                animation: `progressFill ${TOTAL_DURATION}ms ease-out both`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
