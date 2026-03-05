"use client";

interface LogoProps {
  size?: "mark" | "header" | "hero";
}

/**
 * Logo mark: A stylized calendar page with a seismograph line through it.
 * The "page" curls at the corner. The line represents data/activity.
 */
function LogoMark({ size }: { size: number }) {
  const scale = size / 40;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block" }}
    >
      {/* Calendar page - rounded rect with folded corner */}
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
        strokeWidth={1.5 / scale * scale}
        fill="none"
        opacity="0.6"
      />
      {/* Page fold triangle */}
      <path
        d="M28 6 L36 6 L36 14 Z"
        fill="var(--bg)"
      />
      <path
        d="M28 6 L28 14 L36 14"
        stroke="var(--accent)"
        strokeWidth={1.5}
        fill="var(--bg-surface)"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Top bar (calendar header) */}
      <rect
        x="4"
        y="6"
        width="32"
        height="8"
        rx="3"
        fill="var(--accent)"
        opacity="0.15"
      />
      {/* Calendar pins */}
      <circle cx="12" cy="6" r="1.5" fill="var(--accent)" opacity="0.7" />
      <circle cx="20" cy="6" r="1.5" fill="var(--accent)" opacity="0.7" />
      {/* Seismograph line through the calendar - the signature element */}
      <path
        d="M8 26 L12 26 L14 19 L16 31 L18 22 L20 28 L22 24 L24 26 L28 26"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

export default function Logo({ size = "header" }: LogoProps) {
  const isHero = size === "hero";
  const isMark = size === "mark";

  if (isMark) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <LogoMark size={24} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "20px",
            color: "var(--fg-heading)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          OTD
          <span style={{ color: "var(--accent)" }}>.</span>
        </span>
      </div>
    );
  }

  const markSize = isHero ? 52 : 28;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isHero ? "8px" : "4px",
      }}
    >
      {/* Logo mark */}
      <LogoMark size={markSize} />

      {/* Wordmark */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0px",
        }}
      >
        <span
          className="font-mono uppercase leading-none"
          style={{
            fontSize: isHero ? "11px" : "8px",
            letterSpacing: "0.35em",
            color: "var(--accent)",
            fontWeight: 600,
          }}
        >
          ON THIS
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: isHero ? "56px" : "28px",
            lineHeight: 0.95,
            color: "var(--fg-heading)",
            letterSpacing: "-0.03em",
          }}
        >
          DAY
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>.</span>
        </span>
      </div>
    </div>
  );
}
