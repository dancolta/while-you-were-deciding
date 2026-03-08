import type { SunData } from "@/lib/types";
import * as cache from "@/lib/cache";

interface SunResponse {
  results: {
    sunrise: string;
    sunset: string;
    day_length: number;
  };
  status: string;
}

function formatTime(isoString: string, tz: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  });
}

function formatDayLength(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// Simple reverse geocoding using BigDataCloud (free, no key)
// Results are cached by rounded coordinates so different dates with
// the same location don't re-trigger the API.
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const geoCacheKey = `geo:${lat.toFixed(2)}:${lon.toFixed(2)}`;
  const cachedName = cache.get<string>(geoCacheKey);
  if (cachedName !== undefined) return cachedName;

  const fallback = `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!res.ok) return fallback;
    const data = await res.json();
    const city = data.city || data.locality || data.principalSubdivision || "";
    const country = data.countryName || "";
    let name = fallback;
    if (city && country) name = `${city}, ${country}`;
    else if (city) name = city;
    else if (country) name = country;

    // Cache for 7 days — location names don't change
    cache.set(geoCacheKey, name, 7 * 24 * 60 * 60 * 1000);
    return name;
  } catch {
    return fallback;
  }
}

// Guess timezone from coordinates (rough approximation)
function guessTimezone(lon: number): string {
  const offset = Math.round(lon / 15);
  const hours = Math.abs(offset);
  const sign = offset >= 0 ? "+" : "-";
  // Use Etc/GMT format (note: Etc/GMT signs are inverted)
  try {
    // Try to use the offset directly
    const testDate = new Date();
    const tz = `Etc/GMT${offset <= 0 ? "+" : "-"}${hours}`;
    testDate.toLocaleTimeString("en-US", { timeZone: tz });
    return tz;
  } catch {
    return "UTC";
  }
}

export async function fetchSunData(
  dateStr: string,
  lat?: number,
  lon?: number,
  timezone?: string
): Promise<SunData | null> {
  // Use provided coords or skip
  const useLat = lat ?? null;
  const useLon = lon ?? null;

  if (useLat === null || useLon === null) return null;

  const cacheKey = `sun:${dateStr}:${useLat.toFixed(2)}:${useLon.toFixed(2)}`;
  const cached = cache.get<SunData | null>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const url = `https://api.sunrise-sunset.org/json?lat=${useLat}&lng=${useLon}&date=${dateStr}&formatted=0`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data: SunResponse = await res.json();

    if (data.status !== "OK") {
      cache.set(cacheKey, null, 5 * 60 * 1000);
      return null;
    }

    const tz = timezone || guessTimezone(useLon);
    const locationName = await reverseGeocode(useLat, useLon);

    const dayLengthSeconds = data.results.day_length;
    const dayLengthHours = Math.round((dayLengthSeconds / 3600) * 100) / 100;

    const result: SunData = {
      sunrise: formatTime(data.results.sunrise, tz),
      sunset: formatTime(data.results.sunset, tz),
      day_length_hours: dayLengthHours,
      day_length_formatted: formatDayLength(dayLengthSeconds),
      location_name: locationName,
    };

    cache.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  } catch {
    return null;
  }
}
