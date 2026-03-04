---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - phase-1-brainstorm-synthesis.md
  - phase-2-stress-test-synthesis.md
  - phase-2b-elevation-synthesis.md
workflowType: 'architecture'
project_name: 'While You Were Deciding'
date: '2026-03-04'
---

# Architecture Document — "While You Were Deciding"

A mini web app that reframes personal decision anxiety through cosmic juxtaposition. Users enter a past decision and its date; the app surfaces what else was happening on Earth and in space at that moment, then delivers the result as a cinematic reveal sequence and shareable card.

---

## 1. System Overview

### 1.1 Architecture Pattern

Single-tier Next.js application deployed on Vercel. The App Router handles both client rendering and server-side API logic. No separate backend, no database, no external state management.

```
Client (Next.js App Router)              Server (API Routes on Vercel)
+----------------------------+           +--------------------------------+
|                            |           |                                |
| / (landing + form)         |--POST---->| /api/generate                  |
|   InputForm.tsx            |           |   Validate + sanitize input    |
|   Progressive reveal       |           |   Check in-memory cache (Map)  |
|                            |           |   Promise.allSettled(4 APIs)   |
|                            |<--JSON----|   3s AbortController timeout   |
|   RevealSequence.tsx       |           |   Aggregate + curate           |
|   MissionCard.tsx          |           |   Cache results                |
|   ShareControls.tsx        |           |                                |
|                            |--GET----->| /api/card/[hash].png           |
|   Download image           |           |   Satori + @vercel/og -> PNG   |
|                            |<--PNG-----|   <100ms generation            |
|                            |           |                                |
| /b/[hash] (share page)    |--GET----->| /api/og/[hash]                 |
|   Dynamic OG meta tags     |           |   Satori OG image render       |
|                            |<--PNG-----|                                |
+----------------------------+           +--------------------------------+
```

### 1.2 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 (App Router) | Unified client/server, Vercel-native, Satori compatibility |
| Styling | Tailwind CSS 4 | Rapid iteration, dark theme utilities, no runtime CSS |
| Card rendering | Satori + @vercel/og | <100ms server-side PNG, edge-compatible, no Puppeteer |
| Caching | In-memory `Map` | 366 max date keys for Wikipedia; no Redis needed at MVP scale |
| Deployment | Vercel | Zero-config, auto-scaling, edge functions, native Next.js support |
| Database | None | Stateless app; all data is derived from APIs or static lookups |
| Auth | None | No accounts, no stored user data; privacy is a feature |

---

## 2. Technology Stack

### 2.1 Core

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 15.x (App Router) |
| Runtime | Node.js | 20.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Fonts | IBM Plex Mono + IBM Plex Sans | Google Fonts (self-hosted for Satori) |
| Card generation | Satori + @vercel/og | Latest |
| Deployment | Vercel | Managed |

### 2.2 Dependencies (Expected)

```
next, react, react-dom
@vercel/og (Satori wrapper for OG + card images)
tailwindcss
```

No ORM, no database driver, no auth library, no state management library. The dependency surface is intentionally minimal.

---

## 3. External API Integration

All API calls are server-side only (Next.js API routes). No API keys or external requests from the client.

### 3.1 Wikipedia On This Day

| Property | Value |
|----------|-------|
| Endpoint | `GET https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/{MM}/{DD}` |
| Auth | None |
| Rate limit | 200 req/s |
| Historical coverage | Month/day events across all years |
| Cache key | `wiki:{MM}-{DD}` |
| Cache TTL | 24 hours |
| Timeout | 3 seconds |
| Fallback | Section omitted; card still valid |

**Curation logic:** Score events by description length, recency, and tonal contrast with user's decision. Select top 1-3 events. Apply sensitivity keyword filter. For dates matching traumatic events, show events from other years only.

### 3.2 USGS Earthquake

| Property | Value |
|----------|-------|
| Endpoint | `GET https://earthquake.usgs.gov/fdsnws/event/1/query` |
| Params | `starttime`, `endtime`, `minmagnitude=4.5`, `format=geojson` |
| Auth | None |
| Rate limit | No published limit |
| Cache key | `usgs:{YYYY-MM-DD}` |
| Cache TTL | Infinite (past dates); 1 hour (today) |
| Timeout | 3 seconds |
| Fallback | "The Earth held still -- but your mind didn't." |

**Curation logic:** Select largest magnitude event. Frame by magnitude tier: M4.5-5.5 (subtle), M5.5-7.0 (notable), M7.0+ (dramatic). Include distance from user's inferred timezone.

### 3.3 Where The ISS At

| Property | Value |
|----------|-------|
| Endpoint | `GET https://api.wheretheiss.at/v1/satellites/25544` |
| Auth | None |
| Data | Current position only (lat/long, altitude, velocity) |
| Cache key | `iss:current` |
| Cache TTL | 60 seconds |
| Timeout | 2 seconds |
| Fallback | Static poetic line: "The ISS is out there somewhere at 17,500 mph -- and so are you." |

**Framing:** Position is always "right now, as you read this" since only current data is available. Humanize lat/long to nearest country/ocean name.

### 3.4 NASA Near Earth Objects (NEO)

| Property | Value |
|----------|-------|
| Endpoint | `GET https://api.nasa.gov/neo/rest/v1/feed?start_date={YYYY-MM-DD}&end_date={YYYY-MM-DD}` |
| Auth | API key required (env var `NASA_API_KEY`) |
| Rate limit | 1,000 req/hr |
| Cache key | `neo:{YYYY-MM-DD}` |
| Cache TTL | Infinite (past dates); 1 hour (today) |
| Timeout | 3 seconds |
| Fallback | Section omitted; card still valid |

**Curation logic:** Select the most interesting asteroid by a composite of size and proximity. Frame using relatable units: size ("the size of a city bus"), distance ("closer than the Moon"), speed (raw mph).

### 3.5 API Orchestration

All four APIs are called in parallel via `Promise.allSettled()`. Each call wraps an `AbortController` with a 3-second timeout. The orchestrator never blocks on a single API failure -- partial results produce a valid card.

```typescript
const results = await Promise.allSettled([
  fetchWikipedia(month, day, signal),
  fetchEarthquake(date, signal),
  fetchISS(signal),
  fetchAsteroid(date, signal),
]);
```

---

## 4. Static Data (No API Required)

### 4.1 ISS Crew Lookup

A JSON mapping of date ranges to ISS expedition numbers and crew member names, covering 2000 to present. Approximately 150 lines of static data in `lib/crew-data.ts`. Updated manually when new expeditions launch (low frequency -- roughly every 6 months).

### 4.2 Birth/Death Rates

Lookup table by decade using UN World Population Prospects data. Stored in `lib/demographics.ts`. Used for the "X,XXX babies were born" framing line.

### 4.3 Sensitivity Blocklist

A curated list of 50-100 keywords associated with globally traumatic events (e.g., "September 11", "tsunami", "massacre"). Stored in `lib/sensitivity.ts`. When a Wikipedia event description matches a keyword for the user's specific year, that event is excluded from results.

---

## 5. Caching Architecture

### 5.1 Strategy

In-memory `Map<string, CacheEntry>` stored at module scope in the API route. No external cache store needed for MVP.

```typescript
interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number; // milliseconds, -1 = infinite
}
```

### 5.2 Cache Keys and TTLs

| Source | Cache Key Pattern | TTL | Max Entries |
|--------|------------------|-----|-------------|
| Wikipedia | `wiki:{MM}-{DD}` | 24 hours | 366 |
| USGS | `usgs:{YYYY-MM-DD}` | Infinite (past) / 1h (today) | Unbounded* |
| NASA NEO | `neo:{YYYY-MM-DD}` | Infinite (past) / 1h (today) | Unbounded* |
| ISS | `iss:current` | 60 seconds | 1 |

*In practice, bounded by Vercel function memory limits. A single date entry is <10KB. At 10,000 unique dates, total cache is ~100MB -- well within Vercel limits. For dates older than 30 days with no cache hit in 24 hours, entries can be evicted via LRU if needed in a future iteration.

### 5.3 Cache Invalidation

Past dates never change. Cache is only invalidated by:
- TTL expiration (Wikipedia, ISS, today's USGS/NEO)
- Vercel function cold start (full cache reset -- acceptable for MVP)

---

## 6. Data Flow

### 6.1 Primary Flow (User generates a briefing)

```
1. User enters decision text + date in InputForm
2. Client validates input locally (date range, character limits)
3. Client POSTs to /api/generate with { decision, date, why? }
4. Server validates + sanitizes input
5. Server checks in-memory cache for each API source
6. Cache misses trigger parallel API calls (Promise.allSettled, 3s timeout each)
7. Server aggregates results: curate events, select earthquake, pick asteroid, get ISS
8. Server caches results by date key
9. Server returns JSON response:
   {
     decision, date, why,
     events: WikiEvent[],
     earthquake: EarthquakeData | null,
     asteroid: AsteroidData | null,
     iss: ISSData | null,
     crew: CrewData | null,
     demographics: { births: number, deaths: number },
     closing: string,
     hash: string
   }
10. Client receives JSON -> plays RevealSequence (pure frontend animation, no network)
11. After reveal completes, MissionCard and ShareControls appear
```

### 6.2 Card Image Generation

```
1. Client requests /api/card/[hash].png
2. Server decodes hash -> retrieves briefing data from cache
3. Satori renders JSX template (card-template.tsx) to SVG
4. @vercel/og converts SVG to PNG (1080x1350, 4:5 ratio)
5. Response: image/png with cache headers
```

### 6.3 Social Share Flow

```
1. User clicks "Copy Link" -> copies whileyouweredeciding.com/b/[hash]
2. Recipient opens link -> /b/[hash]/page.tsx serves HTML with dynamic OG tags
3. OG image URL points to /api/og/[hash] -> Satori renders preview card
4. Page content: "Someone got their briefing. Get yours." + input form
5. Recipient generates their own briefing (the Wordle mechanic)
```

### 6.4 Hash Strategy

The `[hash]` is a short, URL-safe identifier derived from the briefing data. It encodes the decision text + date so the server can reconstruct the card without a database.

Implementation: Base64url-encode a JSON payload of `{ decision, date }`, truncated or compressed to keep URLs short. The hash is deterministic -- same input always produces same hash.

---

## 7. File Structure

```
app/
  layout.tsx              Root layout: fonts, meta, dark theme wrapper
  page.tsx                Landing page: form + reveal + card (single-page app)
  globals.css             Dark theme tokens, animation keyframes, Tailwind config
  b/[hash]/
    page.tsx              Share landing page: OG tags + "Get yours" CTA
  api/
    generate/
      route.ts            Main API: validate, fetch, cache, aggregate, respond
    card/[hash]/
      route.ts            Satori PNG generation (1080x1350 shareable card)
    og/[hash]/
      route.ts            Satori OG image for social previews

components/
  InputForm.tsx           Progressive form: decision, date, why (optional)
  RevealSequence.tsx      Choreographed 5.5s animation sequence
  MissionCard.tsx         Card display component (mirrors Satori template)
  ShareControls.tsx       Save image + copy link + pre-populated share text

lib/
  apis/
    wikipedia.ts          On This Day fetcher + event curation + sensitivity filter
    earthquake.ts         USGS fetcher + magnitude-tiered framing
    iss.ts                ISS position fetcher + country/ocean humanization
    asteroid.ts           NASA NEO fetcher + relatable-units framing
  cache.ts                In-memory Map cache with TTL support
  copy.ts                 All templated narrative copy (meanwhile, closing, framing)
  crew-data.ts            ISS expedition lookup table (date range -> crew)
  demographics.ts         Birth/death rates by decade (UN data)
  sensitivity.ts          Traumatic date keyword blocklist
  sanitize.ts             Input validation: HTML stripping, date range, char limits
  types.ts                TypeScript interfaces for all data shapes
  card-template.tsx       Satori JSX template for card rendering

public/
  fonts/
    IBMPlexMono-*.woff2   Self-hosted for Satori (Satori cannot fetch Google Fonts)
    IBMPlexSans-*.woff2
  sounds/
    reveal-tone.mp3       Optional sub-bass hum (0.8s, off by default)
```

---

## 8. Component Architecture

### 8.1 Page Components

**`app/page.tsx`** -- The entire user experience lives on one page. Manages three states:
1. `input` -- Form visible, no data
2. `loading` -- Data fetched, preparing reveal (form fades)
3. `revealed` -- Animation complete, card + share controls visible

State transitions are unidirectional. "Try another" resets to `input`.

**`app/b/[hash]/page.tsx`** -- Server component. Reads hash, generates OG meta tags, renders CTA page. No client JavaScript needed beyond the form.

### 8.2 Client Components

| Component | Responsibility | State |
|-----------|---------------|-------|
| `InputForm` | Collect decision, date, why; validate; submit | Controlled form state |
| `RevealSequence` | Orchestrate 5.5s timed animation from data JSON | Internal timer state |
| `MissionCard` | Render the final briefing card (HTML mirror of Satori template) | Props only |
| `ShareControls` | Download PNG, copy link, show share text options | Minimal UI state |

### 8.3 Data Prefetch Strategy

When the user fills in the date field (before clicking DECLASSIFY), the client can optionally fire a prefetch request to `/api/generate` with just the date. By the time the user submits, data is likely cached server-side. The reveal animation has zero network dependency.

---

## 9. Security

### 9.1 Input Sanitization

All user input is sanitized server-side in `lib/sanitize.ts`:
- Strip all HTML tags (regex + DOMPurify-like logic)
- Validate date: must be between 1950-01-01 and today
- Character limits: decision (100 chars), why (140 chars)
- Reject future dates with user-friendly message
- Reject dates before 1950 with: "Our instruments can't reach that far back"

### 9.2 API Key Protection

- `NASA_API_KEY` stored in `.env.local`, accessed only in server-side API routes
- Never prefixed with `NEXT_PUBLIC_`
- Never exposed in client bundles or network responses

### 9.3 HTTP Security Headers

Applied via `next.config.js` or middleware:
- `Content-Security-Policy`: restrict script-src, style-src, img-src
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 9.4 Rate Limiting

- `/api/generate`: 10 requests per minute per IP
- Implementation: in-memory Map tracking IP + timestamp windows
- Exceeded limit returns `429 Too Many Requests` with retry-after header

### 9.5 OG Tag Injection Prevention

User decision text rendered in OG meta tags is HTML-entity-encoded to prevent meta tag injection.

---

## 10. Performance Budget

| Metric | Target | Strategy |
|--------|--------|----------|
| First Contentful Paint | <1.5s | Static landing, minimal JS, Vercel CDN |
| API response (cache hit) | <50ms | In-memory Map lookup, no I/O |
| API response (cache miss) | <4s | 3s timeout per API, parallel calls |
| Card PNG generation | <100ms | Satori + @vercel/og on edge |
| Total reveal animation | 5.5s | Intentional pacing, not latency |
| Client JS bundle | <80KB gzipped | No heavy deps, Tailwind purge |

### 10.1 Optimization Notes

- Fonts loaded via `next/font` with `display: swap` and preload
- Self-hosted font files in `/public/fonts/` for Satori compatibility
- No client-side API calls during reveal (all data pre-fetched)
- Card images served with aggressive `Cache-Control` headers
- Static assets on Vercel CDN (edge-cached globally)

---

## 11. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Reduced motion | `prefers-reduced-motion: reduce` -> instant card display, 300ms fade, no typewriter |
| Contrast | WCAG AAA (10.5:1) on primary text. Off-white `#E0E0E0` to reduce halation |
| Screen readers | `aria-live="polite"` on reveal sections; semantic `article`, `section`, `time`, `blockquote` |
| Keyboard | Full keyboard navigation through form; focus management during reveal |
| Focus indicators | Visible focus rings on all interactive elements |
| Color independence | No information conveyed by color alone |

---

## 12. Edge Cases and Graceful Degradation

| Scenario | Behavior |
|----------|----------|
| Future date | Rejected: "This decision hasn't happened yet. Come back after." |
| Date before 1950 | Rejected: "Our instruments can't reach that far back." |
| Today's date | Valid. ISS is live; USGS/NEO use 1h cache TTL |
| Feb 29 on non-leap year | Standard date parsing rejects; prompt user |
| Traumatic date (e.g., 9/11) | Sensitivity filter excludes matching-year events; show other years |
| Empty Wikipedia results | Section omitted; card remains valid |
| Empty earthquake results | Fallback: "The Earth held still -- but your mind didn't." |
| Empty asteroid results | Section dropped gracefully |
| ISS API timeout (>2s) | Fallback: static poetic line |
| All 4 APIs fail | Card shows decision + "The universe kept its records sealed that day." |
| Long decision text | Hard cap at 100 chars; dynamic font sizing on card |
| XSS in input | Server-side HTML stripping before storage or rendering |
| Non-English input | Allowed; IBM Plex has broad Unicode coverage |
| Repeated generation (same date) | Vary closing tagline (5-7 variants); vary event selection |
| Birthday detection | Easter egg: "That's the day you arrived. Think of it as a debut." |
| Feb 14, 1990 | Easter egg: Pale Blue Dot quote (Voyager 1 photo day) |

---

## 13. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NASA_API_KEY` | Yes | NASA API key for NEO endpoint (free, 1000 req/hr) |

No other environment variables required for MVP. No database URLs, no auth secrets, no third-party service keys.

---

## 14. Deployment

### 14.1 Platform: Vercel

- Git push to `main` triggers automatic deployment
- Preview deployments on pull requests
- Edge functions for API routes (low latency globally)
- Built-in CDN for static assets

### 14.2 Build Configuration

```
Framework: Next.js (auto-detected)
Build command: next build
Output: .next/
Node.js: 20.x
```

### 14.3 Domain

Target: `whileyouweredeciding.com` (or Vercel subdomain for MVP)

---

## 15. Future Considerations (Post-MVP)

These are explicitly out of scope for the initial build but noted for architectural awareness:

- **Persistent storage:** If briefing counts or analytics are needed, add a lightweight KV store (Vercel KV or Upstash Redis)
- **LLM narration:** AI-generated personalized narrative weaving all data points (replaces templated copy)
- **Internationalization:** Wikipedia API supports multiple languages; ISS crew data is language-neutral
- **Retention mechanic:** "Revisit your briefing in 1 year" via email opt-in
- **Analytics:** Simple event tracking (generations, shares, downloads) via Vercel Analytics or Plausible

---

## 16. Architecture Invariants

These constraints must hold true across all future changes:

1. **No user accounts.** No login, no email gate, no stored personal data.
2. **No client-side API calls to external services.** All external data flows through server-side routes.
3. **No database for MVP.** Stateless, cache-only.
4. **Reveal animation has zero network dependency.** All data is fetched before animation begins.
5. **Every API failure is graceful.** A card is always produced, even if all APIs fail.
6. **User decision text is always sanitized server-side** before rendering in HTML, OG tags, or Satori.
7. **The NASA API key never appears in client bundles.**
