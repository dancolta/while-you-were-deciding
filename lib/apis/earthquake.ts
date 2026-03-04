import type { EarthquakeData } from "@/lib/types";
import * as cache from "@/lib/cache";

interface USGSFeature {
  properties: {
    mag: number;
    place: string;
  };
}

interface USGSResponse {
  features: USGSFeature[];
}

export async function fetchEarthquake(
  dateStr: string
): Promise<EarthquakeData | null> {
  const cacheKey = `usgs:${dateStr}`;
  const cached = cache.get<EarthquakeData | null>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const startDate = dateStr;
    const nextDay = new Date(dateStr + "T00:00:00Z");
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const endDate = nextDay.toISOString().split("T")[0];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&minmagnitude=4.5&limit=10&orderby=magnitude`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data: USGSResponse = await res.json();

    if (!data.features || data.features.length === 0) {
      cache.set(cacheKey, null, 0);
      return null;
    }

    // Already ordered by magnitude desc, take first
    const largest = data.features[0];
    const result: EarthquakeData = {
      magnitude: largest.properties.mag,
      location: largest.properties.place || "Unknown location",
      distance_description: largest.properties.place || "Unknown location",
    };

    cache.set(cacheKey, result, 0);
    return result;
  } catch {
    return null;
  }
}
