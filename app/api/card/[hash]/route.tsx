import { NextRequest, NextResponse } from "next/server";
import type { BriefingData } from "@/lib/types";

// In-memory store for briefing data (used for card generation)
const briefingStore = new Map<string, BriefingData>();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;

  try {
    const data: BriefingData = await request.json();
    briefingStore.set(hash, data);

    // Generate card image using @vercel/og (Satori)
    const { ImageResponse } = await import("@vercel/og");

    const formattedDate = new Date(data.date + "T12:00:00").toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
    const briefingNum = String(data.briefing_number).padStart(7, "0");

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: "1080px",
            height: "1350px",
            backgroundColor: "#0a0e17",
            color: "#c8d6e5",
            display: "flex",
            flexDirection: "column",
            padding: "60px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "16px",
                  letterSpacing: "0.2em",
                  color: "#6b7b8d",
                  textTransform: "uppercase",
                }}
              >
                Mission Log // {formattedDate}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#6b7b8d",
                  opacity: 0.5,
                  marginTop: "4px",
                }}
              >
                Briefing #{briefingNum}
              </span>
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#e74c3c",
                border: "1px solid rgba(231, 76, 60, 0.3)",
                padding: "4px 12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                transform: "rotate(-2deg)",
              }}
            >
              DECIDED
            </div>
          </div>

          {/* Decision */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "60px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#6b7b8d",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              While you were deciding
            </span>
            <span
              style={{
                fontSize: "48px",
                color: "#e8e8e8",
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {data.decision}
            </span>
          </div>

          {/* Data points */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "50px",
              fontSize: "20px",
              lineHeight: 1.5,
            }}
          >
            {data.earthquake && (
              <span>
                the ground shook in {data.earthquake.location} (M
                {data.earthquake.magnitude})
              </span>
            )}
            {data.asteroid && (
              <span>
                asteroid {data.asteroid.name} slipped past (
                {data.asteroid.distance_comparison})
              </span>
            )}
            {data.iss && <span>the ISS passed {data.iss.location_name}</span>}
            {data.wikipedia.length > 0 && (
              <span>
                {data.wikipedia[0].text.length > 120
                  ? data.wikipedia[0].text.slice(0, 117) + "..."
                  : data.wikipedia[0].text}
              </span>
            )}
            <span style={{ fontSize: "16px", color: "#6b7b8d" }}>
              {data.demographics.framed}
            </span>
          </div>

          {/* Significance */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "40px",
            }}
          >
            <span style={{ fontSize: "14px", color: "#6b7b8d", opacity: 0.5 }}>
              Cosmic significance: 0.0000000%
            </span>
            <span
              style={{
                fontSize: "28px",
                color: "#e8e8e8",
                marginTop: "8px",
              }}
            >
              To you: immeasurable.
            </span>
          </div>

          {/* Closing */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "auto",
              paddingTop: "30px",
              borderTop: "1px solid rgba(200, 214, 229, 0.12)",
            }}
          >
            <span style={{ fontSize: "20px", lineHeight: 1.6 }}>
              {data.closing_line}
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#6b7b8d",
                opacity: 0.3,
                marginTop: "20px",
              }}
            >
              whileyouweredeciding.com
            </span>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1350,
      }
    );

    return new NextResponse(imageResponse.body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Card generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate card" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;
  const data = briefingStore.get(hash);

  if (!data) {
    return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
