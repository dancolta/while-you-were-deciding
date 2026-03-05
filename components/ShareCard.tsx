"use client";

import type { BriefingData } from "@/lib/types";

interface ShareCardProps {
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

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3).replace(/\s+\S*$/, "") + "...";
}

export default function ShareCard({ data }: ShareCardProps) {
  const formattedDate = formatDate(data.date);

  // Build fact entries with category colors
  const facts: { text: string; color: string }[] = [];

  if (data.earthquake) {
    facts.push({
      text: `A ${data.earthquake.magnitude} earthquake shook ${data.earthquake.location}`,
      color: "#C4432A",
    });
  }

  if (data.asteroid) {
    facts.push({
      text: `Asteroid ${data.asteroid.name} passed at ${data.asteroid.distance_comparison}`,
      color: "#2563EB",
    });
  }

  if (data.iss) {
    facts.push({
      text: `The ISS flew over ${data.iss.location_name}`,
      color: "#2563EB",
    });
  }

  if (data.sun) {
    facts.push({
      text: `${data.sun.location_name}: sunrise ${data.sun.sunrise}, sunset ${data.sun.sunset} — ${data.sun.day_length_formatted} of light`,
      color: "#D97706",
    });
  }

  if (data.demographics) {
    facts.push({
      text: `${data.demographics.births_per_day.toLocaleString()} took their first breath`,
      color: "#059669",
    });
  }

  if (data.wikipedia.length > 0 && facts.length < 6) {
    const selectedYear = new Date(data.date + "T12:00:00").getFullYear();
    const evt = data.wikipedia[0];
    const prefix = evt.year !== selectedYear ? `In ${evt.year}: ` : "";
    facts.push({
      text: prefix + truncate(evt.text, 200),
      color: "#7C3AED",
    });
  }

  return (
    <div
      style={{
        width: "1080px",
        height: "1920px",
        backgroundColor: "#0F1720",
        color: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        padding: "100px 90px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top gradient accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: "linear-gradient(90deg, #C45D20, #D97706, #C45D20)",
        }}
      />

      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "600px",
          background: "radial-gradient(ellipse at center, rgba(196, 93, 32, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Brand header */}
      <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
        <span
          style={{
            fontSize: "18px",
            fontFamily: "monospace",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#C45D20",
          }}
        >
          ON THIS
        </span>
        <span
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#F8FAFC",
            lineHeight: 1.0,
          }}
        >
          DAY<span style={{ color: "#C45D20" }}>.</span>
        </span>
      </div>

      {/* Accent divider */}
      <div
        style={{
          width: "80px",
          height: "3px",
          backgroundColor: "#C45D20",
          marginTop: "48px",
          borderRadius: "2px",
        }}
      />

      {/* Date + label */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "48px",
        }}
      >
        <span
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#F8FAFC",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {formattedDate}
        </span>
        {data.label && (
          <span
            style={{
              fontSize: "30px",
              fontStyle: "italic",
              color: "#C45D20",
              marginTop: "16px",
              opacity: 0.9,
            }}
          >
            {data.label}
          </span>
        )}
      </div>

      {/* Thin divider */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "rgba(248, 250, 252, 0.08)",
          marginTop: "48px",
        }}
      />

      {/* Facts */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          marginTop: "48px",
        }}
      >
        {facts.map((fact, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "40px",
                backgroundColor: fact.color,
                borderRadius: "2px",
                marginTop: "6px",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "30px",
                lineHeight: 1.5,
                color: "#E2E8F0",
              }}
            >
              {fact.text}
            </span>
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Thin divider */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "rgba(248, 250, 252, 0.12)",
        }}
      />

      {/* Closing quote */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "48px",
        }}
      >
        <span
          style={{
            fontSize: "38px",
            fontStyle: "italic",
            color: "#F8FAFC",
            lineHeight: 1.4,
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          {"\u201C"}
          {data.closing_line}
          {"\u201D"}
        </span>
      </div>

      {/* Decorative accent bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "48px",
        }}
      >
        <div
          style={{
            width: "160px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #C45D20, transparent)",
            borderRadius: "1px",
          }}
        />
      </div>

      {/* Domain watermark */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "36px",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontFamily: "monospace",
            letterSpacing: "0.15em",
            color: "#C45D20",
            opacity: 0.5,
          }}
        >
          onthisday.nodesparks.com
        </span>
      </div>
    </div>
  );
}
