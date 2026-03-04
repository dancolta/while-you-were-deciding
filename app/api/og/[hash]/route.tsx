import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;

  try {
    const { ImageResponse } = await import("@vercel/og");

    // For OG images, show a teaser — not the full briefing
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            backgroundColor: "#0a0e17",
            color: "#c8d6e5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            fontFamily: "sans-serif",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "0.3em",
              color: "#6b7b8d",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Briefing #{hash.slice(0, 7)}
          </span>
          <span
            style={{
              fontSize: "52px",
              color: "#e8e8e8",
              fontWeight: 600,
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: "24px",
            }}
          >
            While You Were Deciding
          </span>
          <span
            style={{
              fontSize: "22px",
              color: "#6b7b8d",
              textAlign: "center",
              maxWidth: "700px",
            }}
          >
            The universe was busy. You decided anyway. Get your briefing.
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#4ecca3",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: "40px",
              border: "1px solid #4ecca3",
              padding: "12px 32px",
            }}
          >
            Get your briefing
          </span>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );

    return new NextResponse(imageResponse.body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("OG image error:", error);
    return NextResponse.json(
      { error: "Failed to generate OG image" },
      { status: 500 }
    );
  }
}
