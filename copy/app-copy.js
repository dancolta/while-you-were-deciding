/**
 * WHILE YOU WERE DECIDING — App Copy System
 * All templated copy. Use string interpolation with the slot names.
 * Slots use {VARIABLE_NAME} notation for easy find/replace.
 *
 * Sections:
 *  1. MEANWHILE TRANSITIONS
 *  2. DATA FRAMING SENTENCES
 *  3. PERSPECTIVE LINES
 *  4. CLOSING LINE VARIANTS
 *  5. THE ONE LINE — standalone hero candidates
 */


// ─────────────────────────────────────────────────────────────────────────────
// 1. MEANWHILE TRANSITIONS
//    Bridge from "your decision" to "what the world was doing."
//    Pick one at random. Each has a distinct emotional register.
// ─────────────────────────────────────────────────────────────────────────────

export const MEANWHILE_TRANSITIONS = [

  // Register: Quiet awe. The universe as indifferent witness.
  "While you were carrying that decision, the universe kept its own schedule.",

  // Register: Dry, almost wry. Makes the smallness feel like relief, not insult.
  "You were weighing everything. The world was busy with other things.",

  // Register: Tender. Positions the decision as a private act inside a vast public moment.
  "Somewhere in all of this, you were deciding. Nobody announced it. Nothing paused.",

  // Register: Slightly cinematic. Emphasizes the simultaneity — both things were equally real.
  "The date you picked had a whole other life going on. Here's what it looked like.",

  // Register: Philosophical, almost Stoic. Echoes Marcus Aurelius without quoting him.
  "The cosmos did not consult you. It rarely does. This is what it was doing instead.",

  // Register: Warm, second-person intimacy. Like a friend who was there.
  "You didn't know any of this was happening. You were a little preoccupied.",

  // Register: Understated and precise. Lets the data carry the weight without preamble.
  "On the day everything changed for you, here is what was happening everywhere else.",

];


// ─────────────────────────────────────────────────────────────────────────────
// 2. DATA FRAMING SENTENCES
//    These wrap the raw API data and make it feel personal.
//    Each returns a string. Slots: {VARIABLE_NAME}
// ─────────────────────────────────────────────────────────────────────────────


// --- EARTHQUAKE TEMPLATE ---
// Inputs: {MAGNITUDE}, {LOCATION}, {DISTANCE_MILES}, {DISTANCE_KM}
// Use the variant array — pick by magnitude tier or randomly within tier.

export const EARTHQUAKE_FRAMES = {

  // Magnitude < 3.0 — micro, almost imperceptible
  micro: [
    "The ground shifted in {LOCATION} — a quiet magnitude {MAGNITUDE}, {DISTANCE_MILES} miles away. The kind of tremor nobody feels but the instruments catch. The planet stretching in its sleep.",
    "There was a {MAGNITUDE} tremor near {LOCATION}, {DISTANCE_MILES} miles from where you were. Small enough to ignore. The earth had its own restlessness that day.",
  ],

  // Magnitude 3.0–4.9 — noticeable but minor
  minor: [
    "The ground shook near {LOCATION} — magnitude {MAGNITUDE}, {DISTANCE_MILES} miles away. Close enough to rattle a window. Not close enough to matter. You had other things on your mind.",
    "A {MAGNITUDE} earthquake rolled through {LOCATION}, {DISTANCE_MILES} miles from you. People nearby paused. Checked the walls. Then went back to whatever they were doing. So did you.",
  ],

  // Magnitude 5.0–5.9 — moderate, widely felt
  moderate: [
    "The ground shook in {LOCATION} — magnitude {MAGNITUDE}, {DISTANCE_MILES} miles away. Strong enough to wake people up. Strong enough to make them grab the doorframe. You didn't feel it. You had other things on your mind.",
    "A {MAGNITUDE} earthquake hit near {LOCATION} that day. {DISTANCE_MILES} miles from wherever you were standing. The kind that makes the news briefly, then disappears. Like most things do.",
  ],

  // Magnitude 6.0+ — strong, potentially damaging
  strong: [
    "A significant {MAGNITUDE} earthquake struck {LOCATION} — {DISTANCE_MILES} miles from you. The earth made its presence known that day. So did you.",
    "The ground broke open near {LOCATION}. Magnitude {MAGNITUDE}. {DISTANCE_MILES} miles away. Some days ask more of the world than others. This was one of them.",
  ],

};


// --- ASTEROID TEMPLATE ---
// Inputs: {ASTEROID_NAME}, {DIAMETER_FEET}, {DIAMETER_METERS}, {MISS_DISTANCE_MILES}, {MISS_DISTANCE_KM}, {RELATIVE_VELOCITY_MPH}
// "Close" = under 1 million miles. "Far" = over 5 million miles.

export const ASTEROID_FRAMES = {

  // Standard pass — tens of millions of miles
  standard: [
    "Asteroid {ASTEROID_NAME} — roughly {DIAMETER_FEET} feet wide — passed {MISS_DISTANCE_MILES} miles from Earth. That's not nothing. Astronomers noticed. They always do. It wasn't enough to interrupt anything.",
    "A {DIAMETER_FEET}-foot rock called {ASTEROID_NAME} cleared Earth by {MISS_DISTANCE_MILES} miles at {RELATIVE_VELOCITY_MPH} mph. The solar system has its own traffic. Most of it misses. This one did.",
  ],

  // Close approach — within a few million miles, notable
  close: [
    "Asteroid {ASTEROID_NAME} passed closer than you might expect — {MISS_DISTANCE_MILES} miles, moving at {RELATIVE_VELOCITY_MPH} mph. A {DIAMETER_FEET}-foot object, minding its own business. As were you.",
    "{ASTEROID_NAME} came in at {MISS_DISTANCE_MILES} miles. That's close in cosmic terms. The kind of distance that makes planetary defense scientists update their spreadsheets. It cleared. Everything did, that day.",
  ],

  // Very close — inside lunar distance or just beyond
  very_close: [
    "{ASTEROID_NAME} — {DIAMETER_FEET} feet wide, moving at {RELATIVE_VELOCITY_MPH} mph — passed within {MISS_DISTANCE_MILES} miles of the planet you were standing on. Nobody flinched. Nobody knew. Including you.",
    "A {DIAMETER_FEET}-foot rock called {ASTEROID_NAME} threaded the needle at {MISS_DISTANCE_MILES} miles. Closer than you'd probably like to know. The headline that never happened. You made yours instead.",
  ],

};


// --- ISS TEMPLATE ---
// Inputs: {NEAREST_COUNTRY}, {LAT}, {LONG}, {ALTITUDE_MILES}, {SPEED_MPH}, {ORBITS_PER_DAY}
// The ISS completes ~15.5 orbits/day. One orbit = 92 minutes.

export const ISS_FRAMES = [

  "At that moment, humanity's only occupied outpost in space was passing over {NEAREST_COUNTRY} at {ALTITUDE_MILES} miles up, moving at {SPEED_MPH} mph. The crew had no idea you were deciding anything. They were busy surviving in a vacuum.",

  "The International Space Station was somewhere above {NEAREST_COUNTRY} — {ALTITUDE_MILES} miles above the surface, completing an orbit every 92 minutes. The astronauts on board were not consulted about your decision. They had enough going on.",

  "Six humans in a pressurized can were hurtling over {NEAREST_COUNTRY} at {SPEED_MPH} mph while you were deciding. They'd circle the entire planet {ORBITS_PER_DAY} times that day. None of it had anything to do with you. All of it was real.",

  "While you were making your choice, the ISS was over {NEAREST_COUNTRY} — coordinates {LAT}, {LONG} — traveling at {SPEED_MPH} miles per hour, {ALTITUDE_MILES} miles straight up. The planet below was busy. So were the skies above it.",

];


// --- HEADLINE TEMPLATE ---
// Inputs: {HEADLINE}, {SOURCE} (Wikipedia event title), {DATE_FORMATTED}
// These wrap a single pulled event to make it feel like context, not noise.

export const HEADLINE_FRAMES = [

  // Empathetic reframe — both things were happening simultaneously
  "On {DATE_FORMATTED}, the world's attention was on {HEADLINE}. Somewhere quieter, less noticed, you were in the middle of something too.",

  // Parallel lives — neither one knew about the other
  "The news cycle had moved on to {HEADLINE}. It didn't stop to ask what you were carrying. News never does.",

  // Scale without diminishment — both things mattered
  "History was noting {HEADLINE} in its ledger that day. Private decisions don't make the ledger. They make something harder to measure.",

  // Wry/dry — lets the contrast breathe
  "Editors somewhere were writing headlines about {HEADLINE}. Nobody was writing a headline about what you were doing. Some things are too important for that.",

];


// ─────────────────────────────────────────────────────────────────────────────
// 3. PERSPECTIVE LINES
//    One synthesizing sentence at the bottom of the card.
//    Ties the full data set together into a single breath.
//    Slots: {ISS_ORBITS}, {EARTHQUAKE_COUNT}, {ASTEROID_NAME}, {ASTEROID_MISS_MILES}, {DECISION_LABEL}
//    Pick one randomly, or select based on which data is available.
// ─────────────────────────────────────────────────────────────────────────────

export const PERSPECTIVE_LINES = [

  // Full-data version — uses all four data points
  "While you were deciding, the ISS completed {ISS_ORBITS} orbits, the Earth shook {EARTHQUAKE_COUNT} times, and {ASTEROID_NAME} passed {ASTEROID_MISS_MILES} miles from this planet. None of it waited for you. None of it needed to.",

  // Focuses on scale and simultaneity — good when earthquake count is high
  "On the day of your decision, {EARTHQUAKE_COUNT} earthquakes registered somewhere on Earth. A rock called {ASTEROID_NAME} missed us by {ASTEROID_MISS_MILES} miles. The ISS circled the planet {ISS_ORBITS} times. You made your move. The universe made its.",

  // Introspective — ends on the human, not the data
  "The ISS did {ISS_ORBITS} laps. {EARTHQUAKE_COUNT} earthquakes rolled through fault lines nobody was watching. {ASTEROID_NAME} cleared Earth by {ASTEROID_MISS_MILES} miles. And you, somewhere in all that motion, went still long enough to choose.",

  // Shortest and sharpest — works best on the shareable card
  "{ISS_ORBITS} orbits. {EARTHQUAKE_COUNT} earthquakes. One asteroid. One decision. Everything happened at once. Only one of these things was yours.",

];


// ─────────────────────────────────────────────────────────────────────────────
// 4. CLOSING LINE VARIANTS
//    Rotate these. Same emotional register as the original.
//    All end with the same feeling: you did it anyway, and that's enough.
//    The original is preserved here as variant 0.
// ─────────────────────────────────────────────────────────────────────────────

export const CLOSING_LINES = [

  // Original — keep this. It's earned.
  "The world didn't hold its breath. It never does. You decided anyway.",

  // Variant 1: Shifts emphasis to the courage of the private act
  "Nobody marked the moment. No orbit adjusted. No fault line paused. You chose anyway. That counts.",

  // Variant 2: More melancholy, almost elegiac — for the harder decisions
  "The universe was indifferent. It usually is. That's not a tragedy. You moved through it anyway.",

  // Variant 3: Direct and clean — stripped of poetics, hits harder
  "Everything kept going. You still decided. That's the whole story.",

  // Variant 4: Ends on future-facing hope rather than past-facing resolve
  "The world had its agenda. You had yours. Somewhere in that difference, something changed. You made it change.",

  // Variant 5: Philosophical — for users who want to feel the weight
  "Cosmic indifference isn't cruelty. It's permission. The universe didn't stop for you because it didn't need to. You were already enough.",

];


// ─────────────────────────────────────────────────────────────────────────────
// 5. THE ONE LINE
//    If this entire app could be reduced to a single sentence
//    that someone screenshots and posts with no context —
//    these are the five candidates.
//
//    Evaluation criteria:
//      - Works with zero context (no app, no brand, no explanation)
//      - Feels like it was written for the person reading it
//      - Has a cadence that makes it quotable
//      - Says something true that people don't usually say this way
// ─────────────────────────────────────────────────────────────────────────────

export const THE_ONE_LINE_CANDIDATES = [

  // Candidate 1 — THE RECOMMENDED WINNER
  // Works because: It's both cosmic and intimate simultaneously.
  // The word "anyway" carries the whole emotional weight.
  // Reads like a complete thought even without the app.
  "While you were making one of the hardest decisions of your life, an asteroid missed Earth by a million miles and the ISS completed fifteen orbits. The universe is very busy. You decided anyway.",

  // Candidate 2 — Shortest. Most portable. Highest retweet potential.
  // Works because: The contrast does all the work. No explanation needed.
  "The earth shook seventeen times while you were deciding. It does that. So do you.",

  // Candidate 3 — For the philosophical sharer. Ends on a question that isn't a question.
  // Works because: The rhythm — short, short, long — makes it feel like a conclusion.
  "Rocks miss the planet every day. Fault lines slip. The ISS keeps going. And you — somehow, quietly — decided.",

  // Candidate 4 — The most melancholy. Resonates with people who made hard calls.
  // Works because: It validates the smallness without making it feel small.
  "Nothing in the universe knew what you were deciding. Nothing paused. Nothing held space. You didn't need it to.",

  // Candidate 5 — Most direct. Could be a tattoo. Could be a gravestone.
  // Works because: Absolute economy. The weight is in what's NOT said.
  "The world kept moving. You chose anyway. That's all this is. That's everything.",

];


// ─────────────────────────────────────────────────────────────────────────────
// IMPLEMENTATION NOTES
// ─────────────────────────────────────────────────────────────────────────────

/*
SLOT REFERENCE — All interpolation keys used across this file:

  {MAGNITUDE}           — float, e.g. "5.2"
  {LOCATION}            — string, e.g. "Papua New Guinea"
  {DISTANCE_MILES}      — integer, e.g. "3,400"
  {DISTANCE_KM}         — integer, e.g. "5,470"

  {ASTEROID_NAME}       — string, e.g. "2024 YR4"
  {DIAMETER_FEET}       — integer, e.g. "148"
  {DIAMETER_METERS}     — integer, e.g. "45"
  {MISS_DISTANCE_MILES} — formatted string, e.g. "1,200,000"
  {MISS_DISTANCE_KM}    — formatted string, e.g. "1,931,000"
  {RELATIVE_VELOCITY_MPH} — formatted string, e.g. "34,200"

  {NEAREST_COUNTRY}     — string, e.g. "the Pacific Ocean" / "India"
  {LAT}                 — float to 2 decimals, e.g. "28.54"
  {LONG}                — float to 2 decimals, e.g. "77.21"
  {ALTITUDE_MILES}      — integer, e.g. "254"
  {SPEED_MPH}           — formatted string, e.g. "17,500"
  {ORBITS_PER_DAY}      — integer, e.g. "15"

  {HEADLINE}            — string, Wikipedia event title
  {SOURCE}              — string, source label
  {DATE_FORMATTED}      — string, e.g. "March 4, 2026"

  {ISS_ORBITS}          — integer (orbits completed in 24h window), e.g. "15"
  {EARTHQUAKE_COUNT}    — integer (total quakes in USGS feed for that day), e.g. "47"
  {DECISION_LABEL}      — string (user's own words), e.g. "leaving the job"


EARTHQUAKE TIER LOGIC:
  magnitude < 3.0  → EARTHQUAKE_FRAMES.micro
  magnitude < 5.0  → EARTHQUAKE_FRAMES.minor
  magnitude < 6.0  → EARTHQUAKE_FRAMES.moderate
  magnitude >= 6.0 → EARTHQUAKE_FRAMES.strong

ASTEROID TIER LOGIC (miss distance in miles):
  > 5,000,000      → asteroid_frames.standard
  1,000,000–5M     → asteroid_frames.close
  < 1,000,000      → asteroid_frames.very_close

RANDOMIZATION:
  All arrays above should be selected with Math.random() * array.length | 0
  Seed off the decision date so the same date always returns the same variant.
  This makes sharing reproducible — the card a user shares matches what they saw.

MISSION LOG CARD COPY ORDER (recommended):
  1. MEANWHILE_TRANSITIONS (one, random-seeded)
  2. HEADLINE_FRAMES (wrapping top event)
  3. EARTHQUAKE_FRAMES (magnitude-tiered)
  4. ISS_FRAMES (one, random-seeded)
  5. ASTEROID_FRAMES (distance-tiered)
  6. PERSPECTIVE_LINES (one, random-seeded)
  7. CLOSING_LINES (one, random-seeded — or always use the original for the card)
*/
