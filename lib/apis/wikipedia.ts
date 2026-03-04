import type { WikipediaEvent } from "@/lib/types";
import * as cache from "@/lib/cache";
import { isSensitive, SENSITIVE_REFRAME } from "@/lib/sensitivity";
import { stripHtml } from "@/lib/sanitize";

interface WikiApiEvent {
  year: number;
  text: string;
  pages?: unknown[];
}

interface WikiApiResponse {
  selected?: WikiApiEvent[];
  events?: WikiApiEvent[];
  births?: WikiApiEvent[];
  deaths?: WikiApiEvent[];
}

function scoreEvent(text: string): number {
  const len = text.length;
  if (len >= 50 && len <= 200) return 100;
  if (len < 50) return 50 - (50 - len);
  // len > 200
  return Math.max(0, 100 - (len - 200) / 5);
}

export async function fetchWikipediaEvents(
  month: number,
  day: number,
  inputYear?: number
): Promise<WikipediaEvent[]> {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const cacheKey = `wiki:${mm}-${dd}`;

  const cached = cache.get<WikipediaEvent[]>(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${mm}/${dd}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) return [];

    const data: WikiApiResponse = await res.json();

    const allEvents: WikiApiEvent[] = [
      ...(data.selected || []),
      ...(data.events || []),
    ];

    const filtered = allEvents
      .filter((e) => {
        if (inputYear && e.year === inputYear) return false;
        return true;
      })
      .map((e) => ({
        year: e.year,
        text: stripHtml(e.text),
      }));

    // Score and sort, pick top 3
    const scored = filtered
      .map((e) => ({ ...e, score: scoreEvent(e.text) }))
      .sort((a, b) => b.score - a.score);

    const results: WikipediaEvent[] = scored.slice(0, 3).map((e) => ({
      year: e.year,
      text: isSensitive(e.text) ? SENSITIVE_REFRAME : e.text,
    }));

    cache.set(cacheKey, results, 24 * 60 * 60 * 1000);
    return results;
  } catch {
    return [];
  }
}
