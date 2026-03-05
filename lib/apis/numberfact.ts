import type { NumberFact } from "@/lib/types";

function getDayOfYear(dateStr: string): number {
  const date = new Date(dateStr + "T12:00:00Z");
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getMoonPhase(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00Z");
  const knownNew = new Date("2000-01-06T12:00:00Z");
  const synodicMonth = 29.53058867;
  const diff = (date.getTime() - knownNew.getTime()) / (1000 * 60 * 60 * 24);
  const phase = ((diff % synodicMonth) + synodicMonth) % synodicMonth;
  const f = phase / synodicMonth;

  if (f < 0.0625) return "New Moon";
  if (f < 0.1875) return "Waxing Crescent";
  if (f < 0.3125) return "First Quarter";
  if (f < 0.4375) return "Waxing Gibbous";
  if (f < 0.5625) return "Full Moon";
  if (f < 0.6875) return "Waning Gibbous";
  if (f < 0.8125) return "Last Quarter";
  if (f < 0.9375) return "Waning Crescent";
  return "New Moon";
}

function getMoonEmoji(phase: string): string {
  const map: Record<string, string> = {
    "New Moon": "\u{1F311}",
    "Waxing Crescent": "\u{1F312}",
    "First Quarter": "\u{1F313}",
    "Waxing Gibbous": "\u{1F314}",
    "Full Moon": "\u{1F315}",
    "Waning Gibbous": "\u{1F316}",
    "Last Quarter": "\u{1F317}",
    "Waning Crescent": "\u{1F318}",
  };
  return map[phase] || "\u{1F311}";
}

function getZodiacSign(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

export async function fetchNumberFact(
  dateStr: string
): Promise<NumberFact | null> {
  try {
    const date = new Date(dateStr + "T12:00:00Z");
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const dayOfYear = getDayOfYear(dateStr);
    const totalDays = isLeapYear(year) ? 366 : 365;
    const moonPhase = getMoonPhase(dateStr);

    return {
      day_of_year: dayOfYear,
      total_days: totalDays,
      percent_through: Math.round((dayOfYear / totalDays) * 100),
      moon_phase: moonPhase,
      moon_emoji: getMoonEmoji(moonPhase),
      zodiac: getZodiacSign(month, day),
    };
  } catch {
    return null;
  }
}
