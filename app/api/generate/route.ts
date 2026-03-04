import { NextRequest, NextResponse } from "next/server";
import type { BriefingRequest, BriefingData, DatePrecision } from "@/lib/types";
import { sanitizeDecision, sanitizeReason } from "@/lib/sanitize";
import { fetchWikipediaEvents } from "@/lib/apis/wikipedia";
import { fetchEarthquake } from "@/lib/apis/earthquake";
import { fetchAsteroid } from "@/lib/apis/asteroid";
import { fetchISS } from "@/lib/apis/iss";
import { getCrewForDate } from "@/lib/crew-data";
import { getDemographics } from "@/lib/demographics";
import {
  getMeanwhileLine,
  getClosingLine,
  getPerspectiveLine,
  seededRandom,
} from "@/lib/copy";

// ─────────────────────────────────────────────────────────────────────────────
// Rate limiting
// ─────────────────────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
let requestCounter = 0;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip: string): boolean {
  requestCounter++;

  // Clean up every 100 requests
  if (requestCounter % 100 === 0) {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return false;
  }

  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function computeBriefingNumber(date: string, decision: string): number {
  const input = `${date}:${decision}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  // Return a positive 4-6 digit number
  return Math.abs(hash % 900000) + 100000;
}

function isValidPrecision(p: unknown): p is DatePrecision {
  return p === "exact" || p === "month" || p === "year";
}

// ─────────────────────────────────────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: BriefingRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // Validate
  const { date, precision, decision, reason } = body;

  if (!date || !decision) {
    return NextResponse.json(
      { error: "Date and decision are required." },
      { status: 400 }
    );
  }

  if (!isValidPrecision(precision)) {
    return NextResponse.json(
      { error: "Precision must be 'exact', 'month', or 'year'." },
      { status: 400 }
    );
  }

  const parsedDate = new Date(date + "T12:00:00Z");
  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD." },
      { status: 400 }
    );
  }

  const now = new Date();
  if (parsedDate > now) {
    return NextResponse.json(
      { error: "Date cannot be in the future." },
      { status: 400 }
    );
  }

  if (parsedDate.getFullYear() < 1950) {
    return NextResponse.json(
      { error: "Date must be after 1950." },
      { status: 400 }
    );
  }

  // Sanitize
  const cleanDecision = sanitizeDecision(decision);
  const cleanReason = reason ? sanitizeReason(reason) : undefined;

  if (!cleanDecision) {
    return NextResponse.json(
      { error: "Decision text is required." },
      { status: 400 }
    );
  }

  // Extract date parts
  const month = parsedDate.getUTCMonth() + 1;
  const day = parsedDate.getUTCDate();
  const year = parsedDate.getUTCFullYear();
  const dateStr = date;

  // Fetch all APIs in parallel
  const [wikiResult, earthquakeResult, asteroidResult, issResult] =
    await Promise.allSettled([
      fetchWikipediaEvents(month, day, year),
      fetchEarthquake(dateStr),
      fetchAsteroid(dateStr),
      fetchISS(),
    ]);

  const wikipedia =
    wikiResult.status === "fulfilled" ? wikiResult.value : [];
  const earthquake =
    earthquakeResult.status === "fulfilled"
      ? earthquakeResult.value
      : null;
  const asteroid =
    asteroidResult.status === "fulfilled" ? asteroidResult.value : null;
  const iss = issResult.status === "fulfilled" ? issResult.value : null;

  // Crew and demographics
  const crew = getCrewForDate(dateStr);
  const demographics = getDemographics();

  // Generate copy
  const seed = dateStr;
  const meanwhile_line = getMeanwhileLine(seed);
  const closing_line = getClosingLine(seed);

  const perspective_line = getPerspectiveLine(
    {
      issOrbits: 15,
      earthquakeCount: earthquake ? Math.round(earthquake.magnitude * 3) : 17,
      asteroidName: asteroid?.name,
      asteroidMissMiles: asteroid?.distance_comparison,
    },
    seed
  );

  const briefing_number = computeBriefingNumber(dateStr, cleanDecision);

  const briefingData: BriefingData = {
    date: dateStr,
    precision,
    decision: cleanDecision,
    reason: cleanReason,
    wikipedia,
    earthquake,
    asteroid,
    iss,
    crew,
    demographics,
    closing_line,
    meanwhile_line,
    perspective_line,
    briefing_number,
  };

  return NextResponse.json(briefingData);
}
