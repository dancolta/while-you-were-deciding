"use client";

import { useCountUp } from "@/hooks/useCountUp";

interface MagnitudeRingProps {
  magnitude: number;
  animate: boolean;
}

export default function MagnitudeRing({ magnitude, animate }: MagnitudeRingProps) {
  const displayValue = useCountUp(magnitude * 10, 800, animate);
  const fraction = Math.min(magnitude / 7, 1);

  const size = 120;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (animate ? fraction : 0));

  return (
    <div
      className={`relative inline-flex items-center justify-center ${animate ? "animate-spring-pop" : ""}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(42, 37, 32, 0.12)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--quake)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: animate ? "stroke-dashoffset 1.2s ease-out" : "none" }}
        />
      </svg>
      <span
        className="absolute font-mono text-2xl font-bold"
        style={{ color: "var(--accent)" }}
      >
        {(displayValue / 10).toFixed(1)}
      </span>
    </div>
  );
}
