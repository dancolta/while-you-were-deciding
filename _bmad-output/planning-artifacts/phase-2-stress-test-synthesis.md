# Phase 2: Stress Test Synthesis — "While You Were Deciding"

## LAUNCH BLOCKERS (Must resolve before building)

### 1. Traumatic World Events Collision (UX)
**Problem:** User enters a decision date that coincides with 9/11, mass shootings, etc. "The world didn't hold its breath" becomes grotesque when the world absolutely did.
**Solution:**
- Only show events from OTHER years on that calendar date (Wikipedia returns by month/day, not year — this is natural)
- For same-year context, use a sensitivity keyword filter on Wikipedia descriptions
- If a major tragedy keyword is detected, reframe to: "The world was going through its own enormity"
- Maintain a curated blocklist of ~50-100 globally traumatic dates for extra caution

### 2. Personal Decision on Shareable Card (UX)
**Problem:** App encourages vulnerability ("I left my abusive partner") then offers to share it publicly. Accidental oversharing = reputational damage for the user and the app.
**Solution:**
- Default card = PRIVATE (no share prompt immediately)
- "Save Briefing" downloads the full card
- "Share" flow lets user EDIT decision text before sharing, or use a redacted version
- "Why it felt enormous" NEVER appears on the shareable version — stays private

### 3. prefers-reduced-motion Support (Accessibility)
**Problem:** 4-6 second animation sequence can cause vestibular discomfort for ~35% of adults over 40.
**Solution:** 5 lines of CSS — if `prefers-reduced-motion: reduce`, show full card instantly with a simple 300ms fade. Non-negotiable.

### 4. Preload Data Before Reveal (Technical)
**Problem:** If API calls happen during the reveal animation and one fails, the reveal stalls mid-sequence. Broken magic.
**Solution:** Start fetching data when the user fills in the date field (before they even click DECLASSIFY). By the time they submit, data is already cached. Reveal is pure animation, zero network dependency.

### 5. NASA API Key Registration (Technical)
**Problem:** DEMO_KEY = 50 requests/day. Will break in minutes under any real traffic.
**Solution:** Register a proper key at api.nasa.gov (free, instant, 1000 req/hr). Do this before writing a single line of code.

### 6. All API Calls Must Be Server-Side (Technical)
**Problem:** NASA key exposure in client JS, CORS issues with USGS, rate limit vulnerability.
**Solution:** Lightweight backend (Vercel API routes / Cloudflare Workers). Client sends date → server calls all 4 APIs → returns aggregated JSON. Eliminates CORS, protects keys, enables caching.

### 7. XSS / Input Sanitization (Security)
**Problem:** User text renders on cards and in HTML. Script injection via decision text.
**Solution:** Strip all HTML server-side. Use `textContent` not `innerHTML`. CSP headers. HTML-encode OG tags.

---

## KEY DESIGN DECISIONS (Resolved by stress test)

### Architecture
```
Client (Next.js/SvelteKit)              Server (API Routes)
┌─────────────────────┐                 ┌─────────────────────────────┐
│ Progressive form     │──POST /api/───>│ Validate + sanitize input    │
│ Reveal animation     │   generate     │ Check in-memory cache (Map)  │
│ Card display         │                │ Promise.allSettled (4 APIs)  │
│ Save/Share           │<──JSON─────────│ 3s timeout per API           │
│                      │                │ Cache by date (infinite TTL) │
│ Download image       │──GET /api/────>│ Satori → PNG (< 100ms)      │
│                      │   card.png     │                              │
└─────────────────────┘                 └─────────────────────────────┘
```

### Card Rendering: Satori + @vercel/og
- <100ms per render vs 2-5s for Puppeteer
- Works on edge functions
- Flexbox-only CSS is fine for a card layout
- Server-side = consistent rendering across all browsers

### Caching Strategy
| Data | Cache Key | TTL | Notes |
|------|-----------|-----|-------|
| Wikipedia | `wiki:{MM}-{DD}` | 24h | Only 366 possible keys |
| USGS | `usgs:{YYYY-MM-DD}` | Infinite | Past data never changes |
| NASA NEO | `neo:{YYYY-MM-DD}` | Infinite | Past data never changes |
| ISS Position | `iss:current` | 60s | Only current, short TTL |

### ISS Position: "Right Now" Framing
- Open Notify only has current position
- Reframe as: "Right now, as you read this, the ISS is over [location]"
- Use `api.wheretheiss.at` as primary (more reliable than Open Notify)
- Fallback: "The ISS is out there somewhere at 17,500 mph — and so are you."
- 2-second timeout, graceful degradation

### Date Input: Flexible Precision
- Accept three levels: exact date, month+year, year only
- Text input that parses naturally ("June 2019", "2019", "June 14, 2019")
- Fits terminal aesthetic better than a date picker widget
- Min date: 1950 (API data coverage). Max: today.

### Content Curation Algorithm
- **Hard cap: 3 world events, 1 earthquake, 1 asteroid, ISS position**
- Wikipedia events scored by: description length, recency, cultural relevance
- Earthquakes: min magnitude 4.5. If none, use: "The Earth held still — but your mind didn't."
- Asteroids: frame by speed + size, not proximity. "The size of a school bus, traveling at 27,600 mph"
- If <3 total data points available, show graceful degradation message

### "Why It Felt Enormous" Field
- **Optional**, capped at 140 characters
- Appears on personal card only, NEVER on shared card
- If empty, card works fine (extra whitespace replaces section)
- Placeholder: "One word is enough" / "Everything would change"

### "Cosmic Significance Score"
- REVERSE the visual hierarchy: "immeasurable" is dominant, "0.0000000%" is smaller/lighter
- Make it toggleable before sharing (sensitive decisions)
- Drop it entirely if sentiment-detection flags grief/trauma keywords

### Card Content Caps
- Decision text: max 100 characters
- Why field: max 140 characters
- Wikipedia event: 1 event, max 120 chars with "..."
- Earthquake: 1 line summary (largest event)
- Asteroid: 1 line summary (closest/most interesting)
- ISS: always 1 line

---

## COMPETITIVE REALITY CHECK

### True differentiation (confirmed)
- No one combines decision-anchoring + multi-source cosmic data + narrative reframe + shareable artifact
- Adjacent tools exist (NASA Hubble Birthday, BdayRecap, Neal.fun Life Stats) but none have the editorial voice

### Honest vulnerabilities
- **Technically trivial to clone** — 4 free APIs, one weekend of work
- **Moat is editorial voice** — the closing line, the narrative arc, the tone
- **Single-use trajectory** — spike-and-die unless retention mechanic is added
- **AI-narrated version would be stronger** — LLM weaving events into personalized narrative (future threat)

### Defensible assets
1. The name "While You Were Deciding" (register it)
2. The closing line (treat as brand asset)
3. First-mover on this specific frame
4. Quality of execution (the reveal sequence, card design, copy)

---

## EDGE CASES RESOLVED

| Edge Case | Resolution |
|-----------|------------|
| Traumatic date (9/11 etc.) | Sensitivity filter + reframed copy |
| Future date | "This decision hasn't happened yet. Come back after." |
| Today's date | Valid — works normally |
| Birthday detection | "That's the day you arrived. Think of it as a debut." |
| Feb 29 | Native date parsing handles it |
| Date before 1950 | Rejected with message: "Our instruments can't reach that far back" |
| Empty earthquakes | Fallback copy: "The Earth held still" |
| Empty asteroids | Section drops gracefully |
| ISS API down | Fallback: static poetic line + 2s timeout |
| All APIs fail | Card shows user's decision + "The universe kept its records sealed that day" |
| Long text | Hard character limits + dynamic font sizing |
| XSS attempt | Server-side HTML stripping |
| Offensive content | Deferred for MVP (no content hosting = low risk) |
| Non-English input | Allowed, Unicode-capable fonts (IBM Plex + Noto Sans) |
| Multiple card generations | Vary closing tagline (5-7 variants), vary event selection |
| Desktop progressive form | Show all fields on desktop, progressive on mobile |
| Repeat typewriter effect | First visit only; click-to-skip always available |

---

## NEXT: Phase 3 — BMAD Planning
- Product Brief → PRD → Architecture → UX Design
- Using BMAD structured workflows
