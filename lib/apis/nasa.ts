import type { NasaApod } from "@/lib/types";
import * as cache from "@/lib/cache";

interface ApodResponse {
  title: string;
  explanation: string;
  url: string;
}

export async function fetchNasaApod(
  dateStr: string
): Promise<NasaApod | null> {
  // APOD is only available from June 16, 1995 onward
  const date = new Date(dateStr + "T00:00:00Z");
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  if (year < 1995 || (year === 1995 && (month < 6 || (month === 6 && day < 16)))) {
    return null;
  }

  const cacheKey = `apod:${dateStr}`;
  const cached = cache.get<NasaApod | null>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) return null; // Skip without a real API key — DEMO_KEY is rate-limited
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateStr}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data: ApodResponse = await res.json();

    if (!data.title) {
      cache.set(cacheKey, null, 5 * 60 * 1000);
      return null;
    }

    const result: NasaApod = {
      title: data.title,
      explanation: data.explanation,
      url: data.url,
    };

    cache.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  } catch {
    return null;
  }
}
