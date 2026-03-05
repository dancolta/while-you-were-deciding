import type { DemographicsData } from "@/lib/types";

/**
 * Approximate global births and deaths per day by year.
 * Sources: UN World Population Prospects, Our World in Data.
 * Values are interpolated linearly between data points.
 */
const BIRTH_RATE_BY_YEAR: [number, number][] = [
  [1950, 290000],
  [1960, 345000],
  [1970, 370000],
  [1980, 370000],
  [1990, 385000],
  [2000, 380000],
  [2010, 385000],
  [2020, 385000],
  [2025, 382000],
];

const DEATH_RATE_BY_YEAR: [number, number][] = [
  [1950, 140000],
  [1960, 135000],
  [1970, 140000],
  [1980, 145000],
  [1990, 145000],
  [2000, 150000],
  [2010, 155000],
  [2020, 165000],
  [2025, 170000],
];

function interpolate(table: [number, number][], year: number): number {
  if (year <= table[0][0]) return table[0][1];
  if (year >= table[table.length - 1][0]) return table[table.length - 1][1];

  for (let i = 0; i < table.length - 1; i++) {
    const [y0, v0] = table[i];
    const [y1, v1] = table[i + 1];
    if (year >= y0 && year <= y1) {
      const t = (year - y0) / (y1 - y0);
      return Math.round(v0 + t * (v1 - v0));
    }
  }
  return table[table.length - 1][1];
}

export function getDemographics(dateStr: string): DemographicsData {
  const year = new Date(dateStr + "T12:00:00Z").getUTCFullYear();
  const births = interpolate(BIRTH_RATE_BY_YEAR, year);
  const deaths = interpolate(DEATH_RATE_BY_YEAR, year);

  return {
    births_per_day: births,
    deaths_per_day: deaths,
    framed: `${births.toLocaleString("en-US")} people were born. ${deaths.toLocaleString("en-US")} people died.`,
  };
}
