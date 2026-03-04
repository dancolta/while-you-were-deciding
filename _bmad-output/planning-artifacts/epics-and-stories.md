# Epics & Stories — "While You Were Deciding"

**Sprint duration:** 2 days (~16-18 hours total)
**Team:** 1 developer
**Stack:** Next.js 15 (App Router), Tailwind CSS 4, Vercel, Satori

---

## Epic 1: Project Setup & Infrastructure

### SETUP-1: Next.js 15 project initialization with App Router + Tailwind CSS 4
- **Priority:** P0 | **Estimate:** 1h | **Day:** 1 | **Dependencies:** None
- **Description:** Initialize Next.js 15 project with App Router. Configure Tailwind CSS 4 with dark theme defaults. Set up project structure (`/app`, `/lib`, `/components`, `/data`).
- **Acceptance Criteria:**
  - [ ] `npx create-next-app@latest` with App Router enabled
  - [ ] Tailwind CSS 4 configured and working
  - [ ] Base folder structure created: `/app`, `/lib`, `/components`, `/data`
  - [ ] `npm run dev` serves the app on localhost

### SETUP-2: IBM Plex fonts + dark theme + CSS custom properties
- **Priority:** P0 | **Estimate:** 1h | **Day:** 1 | **Dependencies:** SETUP-1
- **Description:** Integrate IBM Plex Mono and IBM Plex Sans via `next/font`. Establish the dark cinematic theme with CSS custom properties for colors, spacing, and typography scale.
- **Acceptance Criteria:**
  - [ ] IBM Plex Mono and IBM Plex Sans loaded via `next/font/google`
  - [ ] CSS custom properties defined for: `--bg`, `--fg`, `--accent`, `--muted`, `--danger`
  - [ ] Dark background (#0a0a0a or similar), light foreground, green/amber accents
  - [ ] Typography scale: monospace for UI chrome, sans for narrative body

### SETUP-3: Vercel deployment + environment variables
- **Priority:** P0 | **Estimate:** 0.5h | **Day:** 1 | **Dependencies:** SETUP-1
- **Description:** Connect repo to Vercel. Configure `.env.local` with NASA API key. Set up environment variables in Vercel dashboard.
- **Acceptance Criteria:**
  - [ ] Vercel project linked and auto-deploying from `main`
  - [ ] `.env.local` with `NASA_API_KEY` (registered, not DEMO_KEY)
  - [ ] `.env.example` committed with placeholder values
  - [ ] Production deploy works at assigned Vercel URL

---

## Epic 2: API Layer & Data

### API-1: `/api/generate` route with input validation + sanitization
- **Priority:** P0 | **Estimate:** 1h | **Day:** 1 | **Dependencies:** SETUP-1
- **Description:** Create the main API route that accepts a POST with `{ date, precision, decision, reason? }`. Validate all fields server-side. Strip HTML from all text inputs. Return aggregated cosmic data JSON.
- **Acceptance Criteria:**
  - [ ] POST `/api/generate` accepts `{ date, precision, decision, reason }`
  - [ ] `date` validated: not future, not before 1950, valid format
  - [ ] `precision` validated: one of `exact`, `month`, `year`
  - [ ] `decision` required, max 100 chars, HTML stripped
  - [ ] `reason` optional, max 140 chars, HTML stripped
  - [ ] Returns 400 with descriptive error for invalid input
  - [ ] All text sanitized via `textContent`-equivalent stripping

### API-2: Wikipedia On This Day integration + event curation
- **Priority:** P0 | **Estimate:** 1.5h | **Day:** 1 | **Dependencies:** API-1
- **Description:** Fetch Wikipedia "On This Day" events for the given month/day. Curate to top 3 events scored by description length and cultural relevance. Apply sensitivity keyword filter for traumatic dates.
- **Acceptance Criteria:**
  - [ ] Fetches from Wikipedia On This Day API for given month/day
  - [ ] Returns events from OTHER years (not the user's input year) to avoid direct tragedy collision
  - [ ] Scores events by description length + keyword relevance
  - [ ] Hard cap: 3 events returned
  - [ ] Sensitivity filter: blocklist of ~50 traumatic-date keywords suppresses matching events
  - [ ] If flagged, copy reframes to: "The world was going through its own enormity"
  - [ ] Fallback if API fails: empty array (graceful degradation)

### API-3: USGS Earthquake integration + magnitude filtering
- **Priority:** P0 | **Estimate:** 1h | **Day:** 1 | **Dependencies:** API-1
- **Description:** Fetch earthquakes from USGS for the given date. Filter to magnitude 4.5+. Return the single largest event with location, magnitude, distance framing.
- **Acceptance Criteria:**
  - [ ] Fetches from USGS earthquake API for exact date (or date range for month/year precision)
  - [ ] Filters to magnitude >= 4.5
  - [ ] Returns single largest earthquake with: `magnitude`, `location`, `distance_description`
  - [ ] Distance framed relative to user's inferred timezone region
  - [ ] Fallback copy if no earthquakes: "The Earth held still -- but your mind didn't."
  - [ ] 3-second timeout, graceful degradation on failure

### API-4: NASA NEO integration + framing logic
- **Priority:** P0 | **Estimate:** 1h | **Day:** 1 | **Dependencies:** API-1
- **Description:** Fetch Near-Earth Objects from NASA NEO API for the given date. Select the most interesting asteroid (closest approach or largest). Frame with relatable size and distance comparisons.
- **Acceptance Criteria:**
  - [ ] Fetches from NASA NEO API using registered API key (not DEMO_KEY)
  - [ ] Selects most notable asteroid by closest approach distance
  - [ ] Returns: `name`, `size_comparison` (school bus, city block, etc.), `speed_mph`, `distance_comparison` (closer/farther than Moon)
  - [ ] 3-second timeout, graceful degradation
  - [ ] If no NEOs for date, section drops gracefully

### API-5: ISS position integration (Where The ISS At) + fallback
- **Priority:** P0 | **Estimate:** 0.5h | **Day:** 1 | **Dependencies:** API-1
- **Description:** Fetch current ISS position from `api.wheretheiss.at`. Frame as "Right now, as you read this..." since historical position is unavailable. Humanize lat/long to nearest country.
- **Acceptance Criteria:**
  - [ ] Fetches current ISS position from `api.wheretheiss.at`
  - [ ] Converts lat/long to human-readable location ("above the Indian Ocean", "over Brazil")
  - [ ] Framed as present-tense: "Right now, as you read this..."
  - [ ] 2-second timeout
  - [ ] Fallback: "The ISS is out there somewhere at 17,500 mph -- and so are you."
  - [ ] 60-second cache TTL (current data only)

### API-6: In-memory cache with TTL strategy
- **Priority:** P0 | **Estimate:** 0.5h | **Day:** 1 | **Dependencies:** API-1
- **Description:** Implement in-memory `Map`-based cache. Wikipedia keyed by `MM-DD` (24h TTL). USGS/NEO keyed by `YYYY-MM-DD` (infinite TTL for past dates). ISS keyed as `iss:current` (60s TTL).
- **Acceptance Criteria:**
  - [ ] `Map`-based cache with TTL support
  - [ ] Wikipedia: `wiki:{MM}-{DD}`, 24h TTL
  - [ ] USGS: `usgs:{YYYY-MM-DD}`, infinite TTL
  - [ ] NASA NEO: `neo:{YYYY-MM-DD}`, infinite TTL
  - [ ] ISS: `iss:current`, 60s TTL
  - [ ] Cache checked before API calls; cache populated after successful API responses

### API-7: ISS crew lookup table (static JSON)
- **Priority:** P1 | **Estimate:** 1h | **Day:** 1 | **Dependencies:** None
- **Description:** Create a static JSON file mapping date ranges to ISS expedition numbers, crew count, and notable crew member names. Covers 2000-present (~150 lines).
- **Acceptance Criteria:**
  - [ ] `/data/iss-crews.json` with date-range-to-crew mappings
  - [ ] Each entry: `{ expedition, start, end, crew_count, crew_names, notable_member }`
  - [ ] Covers 2000 to present
  - [ ] Lookup function returns crew data for any given date
  - [ ] Graceful fallback if date not in range

### API-8: Birth/death rate lookup (static data)
- **Priority:** P2 | **Estimate:** 0.5h | **Day:** 2 | **Dependencies:** None
- **Description:** Static lookup for approximate global births and deaths per day. Used in the perspective/closing line of the card.
- **Acceptance Criteria:**
  - [ ] Static data: ~385,000 births/day, ~165,000 deaths/day (WHO estimates)
  - [ ] Returns framed string: "385,000 people were born. 165,000 died."
  - [ ] Data accessible from both API and card generation

### API-9: Rate limiting (10 req/min per IP)
- **Priority:** P1 | **Estimate:** 0.5h | **Day:** 1 | **Dependencies:** API-1
- **Description:** Implement basic rate limiting on `/api/generate` to prevent abuse. 10 requests per minute per IP using in-memory tracking.
- **Acceptance Criteria:**
  - [ ] Track request count per IP using in-memory Map with 60s window
  - [ ] Return 429 with message after 10 requests in 60 seconds
  - [ ] Clean up expired entries periodically
  - [ ] Works behind Vercel's proxy (use `x-forwarded-for` header)

---

## Epic 3: Frontend -- Input Experience

### INPUT-1: Landing page (dark, cinematic, entrance animation)
- **Priority:** P0 | **Estimate:** 1h | **Day:** 1 | **Dependencies:** SETUP-2
- **Description:** The first screen. Dark, minimal, cinematic. A brief entrance animation (fade + slight translate) reveals the headline and form. Terminal/mission-briefing aesthetic.
- **Acceptance Criteria:**
  - [ ] Full-viewport dark screen
  - [ ] Headline animates in: "While You Were Deciding" (or similar tagline)
  - [ ] Subtitle/prompt: invites user to enter a date
  - [ ] Entrance animation: 600ms fade + translateY, `ease-out`
  - [ ] `prefers-reduced-motion`: no animation, instant display
  - [ ] Mobile-first, works on 375px+ screens

### INPUT-2: Progressive input form (mobile) / all-fields (desktop)
- **Priority:** P0 | **Estimate:** 1.5h | **Day:** 1 | **Dependencies:** INPUT-1
- **Description:** On mobile, fields reveal progressively (date first, then decision, then optional reason). On desktop, show all fields at once. Terminal aesthetic: monospace labels, minimal chrome.
- **Acceptance Criteria:**
  - [ ] Mobile (<768px): progressive reveal -- date field first, decision appears after date is valid, reason appears after decision
  - [ ] Desktop (>=768px): all fields visible from the start
  - [ ] Responsive breakpoint handled via CSS/Tailwind
  - [ ] Smooth transitions between progressive steps (300ms fade)
  - [ ] Form submittable only when required fields (date + decision) are filled

### INPUT-3: Flexible date input (exact, month+year, year only)
- **Priority:** P0 | **Estimate:** 1h | **Day:** 1 | **Dependencies:** INPUT-2
- **Description:** Text input that parses natural date formats: "June 14, 2019", "June 2019", "2019". No date picker widget (doesn't fit terminal aesthetic). Detects precision level automatically.
- **Acceptance Criteria:**
  - [ ] Text input with placeholder: "March 15, 2024" / "June 2019" / "2019"
  - [ ] Parses: exact date, month+year, year only
  - [ ] Detects and sets precision: `exact`, `month`, `year`
  - [ ] Validates: not future, not before 1950
  - [ ] Error messages: "This decision hasn't happened yet" (future), "Our instruments can't reach that far back" (pre-1950)
  - [ ] Visual feedback: green check or red warning inline

### INPUT-4: Decision field with character counter
- **Priority:** P0 | **Estimate:** 0.5h | **Day:** 1 | **Dependencies:** INPUT-2
- **Description:** "What were you deciding?" text input. Max 100 characters with live counter. Placeholder examples that rotate or inspire.
- **Acceptance Criteria:**
  - [ ] Text input, max 100 characters
  - [ ] Live character counter: "23/100"
  - [ ] Counter turns amber at 80+, red at 95+
  - [ ] Placeholder: "to quit my job" / "to say yes" / "to leave"
  - [ ] Required field

### INPUT-5: "Why it felt enormous" optional field
- **Priority:** P1 | **Estimate:** 0.5h | **Day:** 1 | **Dependencies:** INPUT-2
- **Description:** Optional textarea, max 140 chars. This is private -- never shared. Placeholder: "One word is enough."
- **Acceptance Criteria:**
  - [ ] Textarea, max 140 characters with live counter
  - [ ] Clearly labeled as optional
  - [ ] Privacy note: "This stays between you and the cosmos" or similar
  - [ ] Placeholder: "One word is enough"
  - [ ] NEVER included in shared card data

### INPUT-6: "DECLASSIFY" submit button + client-side validation
- **Priority:** P0 | **Estimate:** 0.5h | **Day:** 1 | **Dependencies:** INPUT-2, INPUT-3, INPUT-4
- **Description:** The submit button. Labeled "DECLASSIFY" for thematic consistency. Disabled until form is valid. Triggers data fetch and transitions to reveal.
- **Acceptance Criteria:**
  - [ ] Button text: "DECLASSIFY"
  - [ ] Disabled state (dimmed, no pointer) until date + decision are valid
  - [ ] On click: show loading state, POST to `/api/generate`
  - [ ] Loading state: subtle pulse or "DECRYPTING..." text
  - [ ] On success: transition to reveal sequence
  - [ ] On error: show error message without losing form state

### INPUT-7: Data pre-fetch on date field completion
- **Priority:** P1 | **Estimate:** 0.5h | **Day:** 1 | **Dependencies:** INPUT-3, API-1
- **Description:** When the user finishes entering a valid date, silently start fetching cosmic data in the background. By the time they click DECLASSIFY, data is likely already cached.
- **Acceptance Criteria:**
  - [ ] On date field blur (or after 500ms debounce of valid date), fire background fetch
  - [ ] Fetch is silent -- no loading indicator
  - [ ] Results cached client-side; DECLASSIFY uses cached data if available
  - [ ] If pre-fetch fails silently, DECLASSIFY triggers a fresh fetch
  - [ ] No duplicate requests if date hasn't changed

---

## Epic 4: Frontend -- Reveal Sequence

### REVEAL-1: 5.5-second choreographed animation sequence
- **Priority:** P0 | **Estimate:** 2h | **Day:** 1 | **Dependencies:** INPUT-6, API-1
- **Description:** The core experience. A timed sequence that reveals cosmic data points one by one with the narrative "While you were deciding..." frame. All data pre-loaded; this is pure animation.
- **Acceptance Criteria:**
  - [ ] T+0ms: Screen fades to dark (200ms)
  - [ ] T+300ms: Timestamp types out: "BRIEFING INITIATED // {date}"
  - [ ] T+800ms: User's decision appears (typewriter, ~40ms/char)
  - [ ] T+1500ms: "Meanwhile..." beat (fade in, hold 600ms)
  - [ ] T+2100ms: First data point (earthquake or Wikipedia) with narrative sentence
  - [ ] T+2800ms: Second data point (asteroid)
  - [ ] T+3500ms: Third data point (ISS + crew)
  - [ ] T+4200ms: Cosmic Significance Score line
  - [ ] T+5000ms: Closing tagline (800ms delay, deliberate)
  - [ ] All timing uses CSS `cubic-bezier(0.16, 1, 0.3, 1)`
  - [ ] Never >1.2 seconds between visual changes
  - [ ] Zero network calls during animation

### REVEAL-2: Narrative sentence reframe templates
- **Priority:** P0 | **Estimate:** 1.5h | **Day:** 1 | **Dependencies:** REVEAL-1
- **Description:** Each data point gets wrapped in the narrative frame: "While you were deciding [decision]... [cosmic fact]. [reflection]." Templates vary by data type and magnitude. This is where the editorial voice lives.
- **Acceptance Criteria:**
  - [ ] Earthquake templates tiered by magnitude (4.5-5.5, 5.5-7.0, 7.0+)
  - [ ] Asteroid template with size comparison and speed
  - [ ] ISS template with crew count and named astronaut
  - [ ] Wikipedia event template (most tonally contrasting to user's decision)
  - [ ] 5 "Meanwhile" transition variants (randomly seeded by date)
  - [ ] 5 closing tagline variants (randomly seeded)
  - [ ] All templates are string literals with interpolation -- no AI/LLM calls

### REVEAL-3: ISS crew detail reveal
- **Priority:** P1 | **Estimate:** 0.5h | **Day:** 1 | **Dependencies:** REVEAL-1, API-7
- **Description:** When ISS data point reveals, include the expedition number and a named crew member. If ISS ground track was near user's region, use the "looked down and seen your city" variant.
- **Acceptance Criteria:**
  - [ ] Shows expedition number and crew count
  - [ ] Names one notable crew member
  - [ ] If ISS was near user's timezone region: "Someone aboard could have looked down and seen your city"
  - [ ] If not: standard ISS narrative template
  - [ ] Graceful fallback if crew data unavailable for date

### REVEAL-4: Cosmic Significance Score (inverted hierarchy)
- **Priority:** P0 | **Estimate:** 0.5h | **Day:** 1 | **Dependencies:** REVEAL-1
- **Description:** Display "Cosmic significance: 0.0000000%" in small/muted text, then "To you: immeasurable." in larger, prominent text. The inversion IS the emotional punch.
- **Acceptance Criteria:**
  - [ ] "Cosmic significance: 0.0000000%" in small, muted monospace
  - [ ] "To you: immeasurable." in larger, brighter text below
  - [ ] Visual hierarchy clearly inverted (the "immeasurable" line dominates)
  - [ ] Appears at T+4200ms in the reveal sequence
  - [ ] Optional: toggleable/hideable before sharing (for sensitive decisions)

### REVEAL-5: Click-to-skip on typewriter animations
- **Priority:** P1 | **Estimate:** 0.5h | **Day:** 2 | **Dependencies:** REVEAL-1
- **Description:** Clicking/tapping anywhere during the reveal sequence instantly completes all remaining animations and shows the full briefing. For repeat visitors or impatient users.
- **Acceptance Criteria:**
  - [ ] Click/tap anywhere during reveal skips remaining animation
  - [ ] All content appears instantly (no partial state)
  - [ ] Works on both mobile (tap) and desktop (click)
  - [ ] First visit: animation plays; subsequent visits: still animates but skip is discoverable

### REVEAL-6: prefers-reduced-motion support
- **Priority:** P0 | **Estimate:** 0.25h | **Day:** 1 | **Dependencies:** REVEAL-1
- **Description:** If user has `prefers-reduced-motion: reduce` set, skip all animations. Show the full briefing instantly with a single 300ms fade-in.
- **Acceptance Criteria:**
  - [ ] Detects `prefers-reduced-motion: reduce` via CSS media query
  - [ ] All content shown instantly, single 300ms fade
  - [ ] No typewriter effect, no staggered reveals
  - [ ] All content still present and correctly laid out

---

## Epic 5: Card Generation & Sharing

### CARD-1: Satori JSX card template (1080x1350, 4:5)
- **Priority:** P0 | **Estimate:** 2h | **Day:** 2 | **Dependencies:** REVEAL-2
- **Description:** Build the shareable card using Satori (JSX to SVG). Mission Log layout with the user's decision as hero text. Card includes abbreviated cosmic data, significance score, closing tagline, and "DECIDED" stamp.
- **Acceptance Criteria:**
  - [ ] Card dimensions: 1080x1350px (4:5 ratio for Instagram/social)
  - [ ] Layout matches design spec: MISSION LOG header, briefing number, decision as hero, abbreviated data, significance, closing tagline, URL watermark
  - [ ] "DECIDED" stamp: 2-3 degree rotation, subtle red/amber tint
  - [ ] Sequential briefing number (global counter or hash-based)
  - [ ] IBM Plex fonts embedded in Satori render
  - [ ] Dark background consistent with app theme
  - [ ] Decision text = largest text on card
  - [ ] "Why it felt enormous" NEVER appears on card

### CARD-2: `/api/card/[hash].png` route for PNG generation
- **Priority:** P0 | **Estimate:** 1h | **Day:** 2 | **Dependencies:** CARD-1
- **Description:** API route that takes a hash parameter, looks up the briefing data, renders the Satori template, converts to PNG via `@vercel/og`, and returns the image.
- **Acceptance Criteria:**
  - [ ] GET `/api/card/[hash].png` returns a PNG image
  - [ ] Hash maps to stored briefing data (in-memory or KV)
  - [ ] Satori render + PNG conversion in <100ms target
  - [ ] Correct `Content-Type: image/png` header
  - [ ] Cache-Control headers for CDN caching
  - [ ] 404 for invalid/expired hashes

### CARD-3: Download card button
- **Priority:** P0 | **Estimate:** 0.5h | **Day:** 2 | **Dependencies:** CARD-2
- **Description:** After the reveal sequence completes, show a "Save Briefing" button that downloads the card as PNG. This is the default action -- NOT share.
- **Acceptance Criteria:**
  - [ ] "Save Briefing" button appears after reveal completes
  - [ ] Downloads PNG to device (uses `<a download>` or fetch+blob)
  - [ ] Filename: `briefing-{date}.png`
  - [ ] Works on mobile (iOS Safari, Android Chrome)
  - [ ] Button appears BEFORE any share prompt

### CARD-4: Share flow with editable decision text
- **Priority:** P0 | **Estimate:** 1h | **Day:** 2 | **Dependencies:** CARD-2
- **Description:** "Share" button opens a flow where the user can edit their decision text before sharing (to prevent accidental oversharing of vulnerable decisions). Generates a unique URL with the edited text.
- **Acceptance Criteria:**
  - [ ] "Share" button is secondary to "Save Briefing"
  - [ ] Opens inline editor showing current decision text
  - [ ] User can edit or replace decision text for the shared version
  - [ ] "Why it felt enormous" is NEVER included in shared data
  - [ ] Generates unique hash/URL for the shared version
  - [ ] Shows preview of the card with edited text before confirming

### CARD-5: Pre-populated share text (5 variants)
- **Priority:** P1 | **Estimate:** 0.5h | **Day:** 2 | **Dependencies:** CARD-4
- **Description:** When sharing, offer 5 pre-written share text options the user can pick from or customize. Optimized for different platforms.
- **Acceptance Criteria:**
  - [ ] 5 share text variants available
  - [ ] Default (minimalist): "{date}: The day I [decision]. Here is what else happened."
  - [ ] Challenge variant: "Look up the day you made your biggest decision. I dare you."
  - [ ] User can select a variant or write custom text
  - [ ] Share URL appended automatically
  - [ ] Works with native share sheet (Web Share API) on mobile, copy-to-clipboard on desktop

### CARD-6: Dynamic OG tags via `/api/og/[hash]`
- **Priority:** P0 | **Estimate:** 1.5h | **Day:** 2 | **Dependencies:** CARD-2
- **Description:** When a briefing URL is shared, the OG preview shows the personalized card image. Server-side route generates OG image via Satori for the specific briefing hash.
- **Acceptance Criteria:**
  - [ ] `/api/og/[hash]` returns OG-sized image (1200x630) for the briefing
  - [ ] Shared URL `/b/[hash]` has `<meta og:image>` pointing to `/api/og/[hash]`
  - [ ] OG title: "While You Were Deciding"
  - [ ] OG description includes the decision text (edited/shared version)
  - [ ] Preview renders correctly in: iMessage, WhatsApp, Slack, Twitter/X
  - [ ] Cache headers for CDN

### CARD-7: Shared link landing page (`/b/[hash]`)
- **Priority:** P0 | **Estimate:** 1h | **Day:** 2 | **Dependencies:** CARD-6
- **Description:** When someone opens a shared briefing link, they do NOT see the sharer's full briefing. They see a teaser with the input form: "[Someone] got their briefing. Get yours." This is the Wordle mechanic -- FOMO drives conversion.
- **Acceptance Criteria:**
  - [ ] `/b/[hash]` route renders a landing page
  - [ ] Shows teaser: "[Someone] got their briefing. Get yours."
  - [ ] Optionally shows the sharer's card image as a blurred/redacted preview
  - [ ] CTA leads to the main input form
  - [ ] Full OG tags for social preview (shows the actual card)
  - [ ] If hash is invalid, redirect to home

---

## Epic 6: Polish & Edge Cases

### POLISH-1: Easter eggs (today, future, birthday, Pale Blue Dot)
- **Priority:** P2 | **Estimate:** 0.5h | **Day:** 2 | **Dependencies:** REVEAL-1
- **Description:** Special handling for edge-case dates that create delightful moments.
- **Acceptance Criteria:**
  - [ ] Today's date: works normally (valid input)
  - [ ] Future date: "This decision hasn't happened yet. Come back after."
  - [ ] Feb 14, 1990 (Pale Blue Dot): special closing line referencing the photo
  - [ ] Very old dates (pre-1950): "Our instruments can't reach that far back."
  - [ ] Feb 29: handled natively, no special treatment needed

### POLISH-2: Error states and fallback copy for all API failures
- **Priority:** P0 | **Estimate:** 1h | **Day:** 2 | **Dependencies:** API-1 through API-5
- **Description:** Every API failure has a graceful fallback. If all APIs fail, the card still works with the user's decision and a poetic fallback line.
- **Acceptance Criteria:**
  - [ ] Each API has specific fallback copy (see API stories)
  - [ ] If <3 total data points: graceful degradation message
  - [ ] If ALL APIs fail: "The universe kept its records sealed that day. But you were there. That's the only record that matters."
  - [ ] No blank sections, no error traces visible to user
  - [ ] Card still generates with whatever data is available

### POLISH-3: Mobile Safari testing + viewport fixes
- **Priority:** P0 | **Estimate:** 0.5h | **Day:** 2 | **Dependencies:** All frontend stories
- **Description:** Test and fix issues specific to Mobile Safari: viewport height (100dvh), font rendering, share sheet behavior, download behavior.
- **Acceptance Criteria:**
  - [ ] Uses `100dvh` not `100vh` for full-screen sections
  - [ ] Fonts render correctly on iOS
  - [ ] Download works via share sheet on iOS (no `<a download>` on iOS Safari)
  - [ ] No horizontal overflow on any screen
  - [ ] Animations perform at 60fps on iPhone 12+

### POLISH-4: 404 page with on-brand copy
- **Priority:** P2 | **Estimate:** 0.25h | **Day:** 2 | **Dependencies:** SETUP-1
- **Description:** Custom 404 page that maintains the mission-briefing aesthetic.
- **Acceptance Criteria:**
  - [ ] Custom `not-found.tsx` in App Router
  - [ ] Copy: "BRIEFING NOT FOUND. This file may have been redacted." or similar
  - [ ] Link back to home: "Start a new briefing"
  - [ ] Matches dark theme

### POLISH-5: Loading states
- **Priority:** P0 | **Estimate:** 0.5h | **Day:** 2 | **Dependencies:** INPUT-6
- **Description:** All async operations have clear, on-brand loading states.
- **Acceptance Criteria:**
  - [ ] DECLASSIFY button: "DECRYPTING..." with subtle pulse
  - [ ] Card generation: "RENDERING BRIEFING..." or similar
  - [ ] Share URL generation: brief spinner or text indicator
  - [ ] No raw loading spinners -- all text-based, on-brand

### POLISH-6: Optional reveal sound
- **Priority:** P2 | **Estimate:** 1h | **Day:** 2 | **Dependencies:** REVEAL-1
- **Description:** A single low-resonant hum (0.8s) at the moment of first reveal. Off by default, toggled via a small speaker icon.
- **Acceptance Criteria:**
  - [ ] Single pre-rendered `.mp3` file, <50KB
  - [ ] Plays at T+300ms (first reveal moment)
  - [ ] Off by default
  - [ ] Small speaker icon toggle in corner
  - [ ] Respects user's sound preference in localStorage
  - [ ] Cut this story first if over time budget

---

## Sprint Schedule

### Day 1 (~8-9 hours) -- Core Experience
| Story | Hours | Priority |
|-------|-------|----------|
| SETUP-1: Next.js + Tailwind | 1.0 | P0 |
| SETUP-2: Fonts + dark theme | 1.0 | P0 |
| SETUP-3: Vercel deploy | 0.5 | P0 |
| API-1: Generate route | 1.0 | P0 |
| API-2: Wikipedia | 1.5 | P0 |
| API-3: USGS Earthquakes | 1.0 | P0 |
| API-4: NASA NEO | 1.0 | P0 |
| API-5: ISS position | 0.5 | P0 |
| API-6: Cache layer | 0.5 | P0 |
| API-7: ISS crew JSON | 1.0 | P1 |
| API-9: Rate limiting | 0.5 | P1 |
| INPUT-1: Landing page | 1.0 | P0 |
| INPUT-2: Progressive form | 1.5 | P0 |
| INPUT-3: Date input | 1.0 | P0 |
| INPUT-4: Decision field | 0.5 | P0 |
| INPUT-5: Why field | 0.5 | P1 |
| INPUT-6: DECLASSIFY button | 0.5 | P0 |
| INPUT-7: Data pre-fetch | 0.5 | P1 |
| REVEAL-1: Animation sequence | 2.0 | P0 |
| REVEAL-2: Narrative templates | 1.5 | P0 |
| REVEAL-3: ISS crew detail | 0.5 | P1 |
| REVEAL-4: Significance score | 0.5 | P0 |
| REVEAL-6: Reduced motion | 0.25 | P0 |
| **Day 1 Total** | **~18.75** | |

> Note: Day 1 is overloaded. Developer should prioritize P0 stories and push P1 stories to Day 2 morning if needed. Realistic Day 1 output: ~9 hours of the highest-priority items.

### Day 2 (~8-9 hours) -- Card, Sharing & Polish
| Story | Hours | Priority |
|-------|-------|----------|
| CARD-1: Satori template | 2.0 | P0 |
| CARD-2: Card PNG route | 1.0 | P0 |
| CARD-3: Download button | 0.5 | P0 |
| CARD-4: Share flow | 1.0 | P0 |
| CARD-5: Share text variants | 0.5 | P1 |
| CARD-6: Dynamic OG tags | 1.5 | P0 |
| CARD-7: Shared landing page | 1.0 | P0 |
| REVEAL-5: Click-to-skip | 0.5 | P1 |
| POLISH-1: Easter eggs | 0.5 | P2 |
| POLISH-2: Error fallbacks | 1.0 | P0 |
| POLISH-3: Mobile Safari | 0.5 | P0 |
| POLISH-4: 404 page | 0.25 | P2 |
| POLISH-5: Loading states | 0.5 | P0 |
| POLISH-6: Reveal sound | 1.0 | P2 |
| API-8: Birth/death data | 0.5 | P2 |
| **Day 2 Total** | **~12.25** | |

> Note: Day 2 also overloaded. P2 items (easter eggs, 404, sound, birth/death data) are first to cut. Realistic Day 2 output: ~8-9 hours of P0/P1 items.

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| NASA DEMO_KEY rate limit | Register proper API key before writing code |
| ISS crew JSON labor-intensive | Start with 2020-present, expand if time allows |
| Satori font embedding issues | Test IBM Plex early; fallback to system monospace |
| Mobile Safari download quirk | Use Web Share API as fallback on iOS |
| Day 1 scope creep | Hard cutoff at 9hrs; push remaining to Day 2 AM |
| All APIs down simultaneously | Fallback copy ensures card still generates |
