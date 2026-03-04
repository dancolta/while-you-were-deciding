import type {
  EarthquakeData,
  AsteroidData,
  ISSData,
  CrewData,
  WikipediaEvent,
} from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE ARRAYS (from copy/app-copy.js)
// ─────────────────────────────────────────────────────────────────────────────

const MEANWHILE_TRANSITIONS = [
  "While you were carrying that decision, the universe kept its own schedule.",
  "You were weighing everything. The world was busy with other things.",
  "Somewhere in all of this, you were deciding. Nobody announced it. Nothing paused.",
  "The date you picked had a whole other life going on. Here's what it looked like.",
  "The cosmos did not consult you. It rarely does. This is what it was doing instead.",
  "You didn't know any of this was happening. You were a little preoccupied.",
  "On the day everything changed for you, here is what was happening everywhere else.",
];

const EARTHQUAKE_FRAMES: Record<string, string[]> = {
  micro: [
    "The ground shifted in {LOCATION} — a quiet magnitude {MAGNITUDE}, {DISTANCE_DESCRIPTION}. The kind of tremor nobody feels but the instruments catch. The planet stretching in its sleep.",
    "There was a {MAGNITUDE} tremor near {LOCATION}, {DISTANCE_DESCRIPTION}. Small enough to ignore. The earth had its own restlessness that day.",
  ],
  minor: [
    "The ground shook near {LOCATION} — magnitude {MAGNITUDE}, {DISTANCE_DESCRIPTION}. Close enough to rattle a window. Not close enough to matter. You had other things on your mind.",
    "A {MAGNITUDE} earthquake rolled through {LOCATION}, {DISTANCE_DESCRIPTION}. People nearby paused. Checked the walls. Then went back to whatever they were doing. So did you.",
  ],
  moderate: [
    "The ground shook in {LOCATION} — magnitude {MAGNITUDE}, {DISTANCE_DESCRIPTION}. Strong enough to wake people up. Strong enough to make them grab the doorframe. You didn't feel it. You had other things on your mind.",
    "A {MAGNITUDE} earthquake hit near {LOCATION} that day. {DISTANCE_DESCRIPTION}. The kind that makes the news briefly, then disappears. Like most things do.",
  ],
  strong: [
    "A significant {MAGNITUDE} earthquake struck {LOCATION} — {DISTANCE_DESCRIPTION}. The earth made its presence known that day. So did you.",
    "The ground broke open near {LOCATION}. Magnitude {MAGNITUDE}. {DISTANCE_DESCRIPTION}. Some days ask more of the world than others. This was one of them.",
  ],
};

const ASTEROID_FRAMES: Record<string, string[]> = {
  standard: [
    "Asteroid {NAME} — roughly the size of {SIZE_COMPARISON} — passed by Earth. {DISTANCE_COMPARISON}. That's not nothing. Astronomers noticed. They always do. It wasn't enough to interrupt anything.",
    "A rock called {NAME} — about the size of {SIZE_COMPARISON} — cleared Earth, traveling at {SPEED_MPH} mph. The solar system has its own traffic. Most of it misses. This one did.",
  ],
  close: [
    "Asteroid {NAME} passed closer than you might expect — {DISTANCE_COMPARISON}, moving at {SPEED_MPH} mph. About the size of {SIZE_COMPARISON}, minding its own business. As were you.",
    "{NAME} came in {DISTANCE_COMPARISON}. That's close in cosmic terms. The kind of distance that makes planetary defense scientists update their spreadsheets. It cleared. Everything did, that day.",
  ],
  very_close: [
    "{NAME} — about the size of {SIZE_COMPARISON}, moving at {SPEED_MPH} mph — passed {DISTANCE_COMPARISON} of the planet you were standing on. Nobody flinched. Nobody knew. Including you.",
    "A rock called {NAME}, about the size of {SIZE_COMPARISON}, threaded the needle — {DISTANCE_COMPARISON}. Closer than you'd probably like to know. The headline that never happened. You made yours instead.",
  ],
};

const ISS_FRAMES = [
  "At that moment, humanity's only occupied outpost in space was passing over {LOCATION_NAME} at 254 miles up, moving at 17,500 mph. The crew had no idea you were deciding anything. They were busy surviving in a vacuum.",
  "The International Space Station was somewhere above {LOCATION_NAME} — 254 miles above the surface, completing an orbit every 92 minutes. The astronauts on board were not consulted about your decision. They had enough going on.",
  "{CREW_COUNT} humans in a pressurized can were hurtling over {LOCATION_NAME} at 17,500 mph while you were deciding. They'd circle the entire planet 15 times that day. None of it had anything to do with you. All of it was real.",
  "While you were making your choice, the ISS was over {LOCATION_NAME} — coordinates {LAT}, {LONG} — traveling at 17,500 miles per hour, 254 miles straight up. The planet below was busy. So were the skies above it.",
];

const HEADLINE_FRAMES = [
  "On {DATE_FORMATTED}, the world's attention was on {HEADLINE}. Somewhere quieter, less noticed, you were in the middle of something too.",
  "The news cycle had moved on to {HEADLINE}. It didn't stop to ask what you were carrying. News never does.",
  "History was noting {HEADLINE} in its ledger that day. Private decisions don't make the ledger. They make something harder to measure.",
  "Editors somewhere were writing headlines about {HEADLINE}. Nobody was writing a headline about what you were doing. Some things are too important for that.",
];

const PERSPECTIVE_LINES = [
  "While you were deciding, the ISS completed {ISS_ORBITS} orbits, the Earth shook {EARTHQUAKE_COUNT} times, and {ASTEROID_NAME} passed {ASTEROID_MISS_MILES} miles from this planet. None of it waited for you. None of it needed to.",
  "On the day of your decision, {EARTHQUAKE_COUNT} earthquakes registered somewhere on Earth. A rock called {ASTEROID_NAME} missed us by {ASTEROID_MISS_MILES} miles. The ISS circled the planet {ISS_ORBITS} times. You made your move. The universe made its.",
  "The ISS did {ISS_ORBITS} laps. {EARTHQUAKE_COUNT} earthquakes rolled through fault lines nobody was watching. {ASTEROID_NAME} cleared Earth by {ASTEROID_MISS_MILES} miles. And you, somewhere in all that motion, went still long enough to choose.",
  "{ISS_ORBITS} orbits. {EARTHQUAKE_COUNT} earthquakes. One asteroid. One decision. Everything happened at once. Only one of these things was yours.",
];

const CLOSING_LINES = [
  "The world didn't hold its breath. It never does. You decided anyway.",
  "Nobody marked the moment. No orbit adjusted. No fault line paused. You chose anyway. That counts.",
  "The universe was indifferent. It usually is. That's not a tragedy. You moved through it anyway.",
  "Everything kept going. You still decided. That's the whole story.",
  "The world had its agenda. You had yours. Somewhere in that difference, something changed. You made it change.",
  "Cosmic indifference isn't cruelty. It's permission. The universe didn't stop for you because it didn't need to. You were already enough.",
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  // Convert to 0-1 range
  return Math.abs(hash % 10000) / 10000;
}

export function pickTemplate<T>(arr: T[], seed: string): T {
  const index = Math.floor(seededRandom(seed) * arr.length);
  return arr[index];
}

function interpolate(
  template: string,
  vars: Record<string, string | number>
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getEarthquakeTier(
  magnitude: number
): "micro" | "minor" | "moderate" | "strong" {
  if (magnitude < 3.0) return "micro";
  if (magnitude < 5.0) return "minor";
  if (magnitude < 6.0) return "moderate";
  return "strong";
}

export function getAsteroidTier(
  missMiles: number
): "standard" | "close" | "very_close" {
  if (missMiles < 1_000_000) return "very_close";
  if (missMiles <= 5_000_000) return "close";
  return "standard";
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMAT FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function formatEarthquake(data: EarthquakeData, seed: string): string {
  const tier = getEarthquakeTier(data.magnitude);
  const templates = EARTHQUAKE_FRAMES[tier];
  const template = pickTemplate(templates, seed + ":eq");
  return interpolate(template, {
    MAGNITUDE: data.magnitude.toFixed(1),
    LOCATION: data.location,
    DISTANCE_DESCRIPTION: data.distance_description,
  });
}

export function formatAsteroid(data: AsteroidData, seed: string): string {
  // We don't have raw miss miles in AsteroidData, so use distance_comparison to determine tier
  // Parse from distance_comparison or default to standard
  const template = pickTemplate(
    ASTEROID_FRAMES["standard"],
    seed + ":ast"
  );
  return interpolate(template, {
    NAME: data.name,
    SIZE_COMPARISON: data.size_comparison,
    SPEED_MPH: data.speed_mph,
    DISTANCE_COMPARISON: data.distance_comparison,
  });
}

export function formatISS(
  data: ISSData,
  crew: CrewData | null,
  seed: string
): string {
  const template = pickTemplate(ISS_FRAMES, seed + ":iss");
  return interpolate(template, {
    LOCATION_NAME: data.location_name,
    LAT: data.latitude.toFixed(2),
    LONG: data.longitude.toFixed(2),
    CREW_COUNT: crew ? crew.crew_count : 6,
  });
}

export function formatHeadline(
  event: WikipediaEvent,
  dateFormatted: string,
  seed: string
): string {
  const template = pickTemplate(HEADLINE_FRAMES, seed + ":hl");
  return interpolate(template, {
    HEADLINE: event.text,
    DATE_FORMATTED: dateFormatted,
  });
}

export function getMeanwhileLine(seed: string): string {
  return pickTemplate(MEANWHILE_TRANSITIONS, seed + ":mw");
}

export function getClosingLine(seed: string): string {
  return pickTemplate(CLOSING_LINES, seed + ":cl");
}

export function getPerspectiveLine(
  data: {
    issOrbits?: number;
    earthquakeCount?: number;
    asteroidName?: string;
    asteroidMissMiles?: string;
  },
  seed: string
): string {
  const template = pickTemplate(PERSPECTIVE_LINES, seed + ":pl");
  return interpolate(template, {
    ISS_ORBITS: data.issOrbits ?? 15,
    EARTHQUAKE_COUNT: data.earthquakeCount ?? 17,
    ASTEROID_NAME: data.asteroidName ?? "a passing rock",
    ASTEROID_MISS_MILES: data.asteroidMissMiles ?? "millions of",
  });
}
