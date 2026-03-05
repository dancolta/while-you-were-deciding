"use client";

import { useState, useEffect } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState(0);
  // phase 0: initial (logo mark scales in)
  // phase 1: wordmark fades in
  // phase 2: seismograph line draws
  // phase 3: tagline fades in
  // phase 4: fade out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => onDone(), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        opacity: phase >= 4 ? 0 : 1,
        transition: "opacity 400ms ease-out",
        pointerEvents: phase >= 4 ? "none" : "auto",
      }}
    >
      {/* Logo mark — calendar with seismograph */}
      <div
        style={{
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 1 ? "scale(1)" : "scale(0.8)",
          transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <svg
          width="72"
          height="72"
          viewBox="0 0 40 40"
          fill="none"
        >
          <rect
            x="4"
            y="6"
            width="32"
            height="30"
            rx="3"
            fill="var(--accent)"
            opacity="0.12"
          />
          <rect
            x="4"
            y="6"
            width="32"
            height="30"
            rx="3"
            stroke="var(--accent)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path d="M28 6 L36 6 L36 14 Z" fill="var(--bg)" />
          <path
            d="M28 6 L28 14 L36 14"
            stroke="var(--accent)"
            strokeWidth="1.5"
            fill="var(--bg-surface)"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <rect
            x="4"
            y="6"
            width="32"
            height="8"
            rx="3"
            fill="var(--accent)"
            opacity="0.15"
          />
          <circle cx="12" cy="6" r="1.5" fill="var(--accent)" opacity="0.7" />
          <circle cx="20" cy="6" r="1.5" fill="var(--accent)" opacity="0.7" />
          {/* Seismograph line with draw animation */}
          <path
            d="M8 26 L12 26 L14 19 L16 31 L18 22 L20 28 L22 24 L24 26 L28 26"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
            style={{
              strokeDasharray: 60,
              strokeDashoffset: phase >= 2 ? 0 : 60,
              transition: "stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "12px",
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(8px)",
          transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1) 100ms",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--accent)",
            lineHeight: 1,
          }}
        >
          ON THIS
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "64px",
            lineHeight: 0.95,
            color: "var(--fg-heading)",
            letterSpacing: "-0.03em",
          }}
        >
          DAY
          <span style={{ color: "var(--accent)" }}>.</span>
        </span>
      </div>

      {/* Animated line */}
      <div
        style={{
          width: "120px",
          height: "2px",
          marginTop: "20px",
          overflow: "hidden",
          borderRadius: "1px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
            transform: phase >= 2 ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            transformOrigin: "center",
          }}
        />
      </div>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "15px",
          color: "var(--fg-muted)",
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(6px)",
          transition: "all 500ms ease-out",
          textAlign: "center",
          maxWidth: "280px",
          lineHeight: 1.5,
          marginTop: "20px",
        }}
      >
        Enter a date. See what the world was doing.
      </p>
    </div>
  );
}
