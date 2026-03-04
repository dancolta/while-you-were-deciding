import type { AsteroidData } from "@/lib/types";
import * as cache from "@/lib/cache";

interface NeoCloseApproach {
  close_approach_date: string;
  miss_distance: {
    miles: string;
  };
  relative_velocity: {
    miles_per_hour: string;
  };
}

interface NeoObject {
  name: string;
  estimated_diameter: {
    feet: {
      estimated_diameter_max: number;
    };
  };
  close_approach_data: NeoCloseApproach[];
}

interface NeoResponse {
  near_earth_objects: Record<string, NeoObject[]>;
}

function getSizeComparison(diameterFeet: number): string {
  if (diameterFeet < 30) return "a car";
  if (diameterFeet < 100) return "a house";
  if (diameterFeet < 300) return "a football field";
  if (diameterFeet < 1000) return "a city block";
  return "a small mountain";
}

function formatWithCommas(num: number): string {
  return Math.round(num).toLocaleString("en-US");
}

function getDistanceComparison(missMiles: number): string {
  const lunarDistance = 238900;
  if (missMiles < lunarDistance) {
    return "closer than the Moon";
  }
  const ratio = missMiles / lunarDistance;
  return `about ${ratio.toFixed(1)}x the distance to the Moon`;
}

export async function fetchAsteroid(
  dateStr: string
): Promise<AsteroidData | null> {
  const cacheKey = `neo:${dateStr}`;
  const cached = cache.get<AsteroidData | null>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dateStr}&end_date=${dateStr}&api_key=${apiKey}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data: NeoResponse = await res.json();
    const objects = data.near_earth_objects[dateStr];

    if (!objects || objects.length === 0) {
      cache.set(cacheKey, null, 5 * 60 * 1000);
      return null;
    }

    // Find closest approach
    let closest: NeoObject | null = null;
    let closestDistance = Infinity;

    for (const obj of objects) {
      for (const approach of obj.close_approach_data) {
        const miles = parseFloat(approach.miss_distance.miles);
        if (miles < closestDistance) {
          closestDistance = miles;
          closest = obj;
        }
      }
    }

    if (!closest) {
      cache.set(cacheKey, null, 5 * 60 * 1000);
      return null;
    }

    const approach = closest.close_approach_data[0];
    const diameterFeet = closest.estimated_diameter.feet.estimated_diameter_max;
    const speedMph = parseFloat(approach.relative_velocity.miles_per_hour);
    const missMiles = parseFloat(approach.miss_distance.miles);

    const result: AsteroidData = {
      name: closest.name.replace(/[()]/g, "").trim(),
      size_comparison: getSizeComparison(diameterFeet),
      speed_mph: formatWithCommas(speedMph),
      distance_comparison: getDistanceComparison(missMiles),
    };

    cache.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  } catch {
    return null;
  }
}
