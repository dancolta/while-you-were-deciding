import type { ISSData } from "@/lib/types";
import * as cache from "@/lib/cache";

interface ISSApiResponse {
  latitude: number;
  longitude: number;
}

function getLocationName(lat: number, lng: number): string {
  // Oceans first (cover ~70% of Earth)
  // Pacific Ocean: roughly between 120E-80W (or equivalently, lng > 120 or lng < -80)
  if (lat > -60 && lat < 60) {
    if ((lng > 120 || lng < -80) && !(lng > -80 && lng < -30)) {
      return "the Pacific Ocean";
    }
    if (lng >= -80 && lng < -30) {
      // Could be Atlantic or Americas
      if (lat > 5 && lat < 50 && lng > -100 && lng < -60) {
        return "North America";
      }
      if (lat >= -55 && lat < 15 && lng > -80 && lng < -35) {
        return "South America";
      }
    }
    if (lng >= -30 && lng < 20) {
      return "the Atlantic Ocean";
    }
    if (lng >= 20 && lng <= 120) {
      if (lat > 35 && lat < 70) return "Europe";
      if (lat >= -10 && lat <= 35 && lng >= 60) return "South Asia";
      if (lat >= 10 && lat <= 55 && lng >= 100) return "East Asia";
      if (lat >= -35 && lat < -10 && lng >= 20 && lng <= 55) return "East Africa";
      if (lat >= -35 && lat <= 35 && lng >= 20 && lng <= 55) return "Africa";
      if (lng >= 55 && lng <= 100 && lat >= -10 && lat <= 30) return "the Indian Ocean";
    }
  }

  // High latitudes
  if (lat >= 60) return "the Arctic";
  if (lat <= -60) return "Antarctica";

  // Indian Ocean catch-all
  if (lng >= 20 && lng <= 120 && lat >= -60 && lat < -10) {
    return "the Indian Ocean";
  }

  // North America
  if (lat >= 15 && lat <= 72 && lng >= -170 && lng <= -50) {
    return "North America";
  }

  // South America
  if (lat >= -55 && lat < 15 && lng >= -80 && lng <= -35) {
    return "South America";
  }

  // East Asia / Australia
  if (lat >= -45 && lat < -10 && lng >= 110 && lng <= 180) {
    return "Australia";
  }

  if (lat >= 10 && lat <= 55 && lng >= 100 && lng <= 150) {
    return "East Asia";
  }

  // Default to ocean based on hemisphere
  if (lng > 20 && lng < 120) return "the Indian Ocean";
  if (lng >= -80 && lng <= 0) return "the Atlantic Ocean";
  return "the Pacific Ocean";
}

export async function fetchISS(): Promise<ISSData | null> {
  const cacheKey = "iss:current";
  const cached = cache.get<ISSData>(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544",
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data: ISSApiResponse = await res.json();

    const result: ISSData = {
      latitude: data.latitude,
      longitude: data.longitude,
      location_name: getLocationName(data.latitude, data.longitude),
      is_current: true,
    };

    cache.set(cacheKey, result, 60 * 1000);
    return result;
  } catch {
    return null;
  }
}
