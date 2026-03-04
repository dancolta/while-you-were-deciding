# Product Brief: While You Were Deciding

**Date:** 2026-03-04
**Author:** Dan Colta (Product Manager)
**Status:** Complete

---

## 1. Product Overview

### Product Name
While You Were Deciding

### Tagline
"The world didn't hold its breath. It never does. You decided anyway."

### Elevator Pitch
A mini web app that reframes personal decision anxiety through cosmic juxtaposition. You enter a life-defining decision and its date. The app reveals what the universe was doing at that exact moment --- headlines, earthquakes, ISS position with crew names, passing asteroids, births and deaths --- then generates a shareable "Mission Log" card. The emotional arc: your decision felt enormous, the universe didn't notice, and that indifference is not cruelty --- it's permission. You decided anyway.

### Product Category
Interactive web experience / shareable content generator

### Target Launch
Mini-app challenge entry. 1-2 day development sprint.

---

## 2. Problem Statement

### The Problem
Everyone has had a decision that consumed them --- quitting a job, ending a relationship, moving cities, saying yes. In that moment, the decision feels like the center of the universe. There is no tool that takes that private enormity and places it against the actual backdrop of what was happening on Earth and in space. Existing "on this day" tools are flat trivia lists with zero emotional framing. Decision journals are serious and private with no shareability. Wrapped-style generators use music or fitness data, not personal decisions.

### Who Has This Problem
Adults aged 25-45 who have made life-defining decisions and want perspective on them. Secondary audiences: space and science enthusiasts, the therapy-adjacent crowd processing major life changes, and people who share life milestones on social media.

### Why It Matters Now
Decision fatigue and anxiety are culturally prominent topics. The "Wrapped" format (Spotify, Apple Music, various parodies) has trained users to expect personalized, shareable year-in-review artifacts. But no one has applied this pattern to personal decisions anchored against real-world data. The format is familiar; the content is entirely new.

---

## 3. Vision and Goals

### Product Vision
Create a 60-second experience that makes someone feel seen, slightly awed, and compelled to share. Transform raw API data (earthquake feeds, asteroid passes, ISS telemetry) into narrative poetry through editorial voice and choreographed pacing. The moat is taste and narrative design, not technology.

### Core Insight
The universe's indifference is not cruel. It's permission. This is NOT a "what happened on this day" tool. It is an existential perspective engine that reframes personal decision anxiety through cosmic juxtaposition. The emotional arc moves through three acts: inflation (your decision matters), deflation (the universe didn't notice), reframe ("You decided anyway" = heroic, not insignificant).

### Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Share rate after card generation | 30%+ | Comparable to Receiptify (~30%), Spotify Wrapped (~40%) |
| Time on reveal sequence | >4 seconds | Users watch the full choreographed reveal, not skipping |
| Viral coefficient | >1.0 | Each share generates more than one new user |
| Time to first card | <45 seconds | From landing page to generated Mission Log |
| API success rate | >95% | Promise.allSettled with graceful degradation |

### Non-Goals
- No user accounts, authentication, or database
- No AI/LLM calls (cost + latency constraints)
- No content moderation system (no content hosting = low risk)
- No mobile native app
- No monetization in v1
- No scroll-based long-form narrative (single artifact, not a journey)

---

## 4. Target Audience

### Primary: The Decision Maker (25-45)
People who have faced a life-defining crossroads and emerged on the other side. They are reflective enough to revisit that moment and share-inclined enough to post a card about it. They respond to tone that is neither clinical nor saccharine --- wry, warm, slightly cosmic.

### Secondary: Space/Science Enthusiasts
Drawn by the ISS crew detail, asteroid data, and the mission log aesthetic. They stay for the narrative quality and share because the data is real and verifiable.

### Secondary: Therapy-Adjacent / Self-Improvement
People processing major life changes who find validation in the reframe: "The universe didn't stop for you because it didn't need to. You were already enough." This audience shares in Instagram Stories and private group chats.

### User Behavior Assumptions
- Users will spend 15-30 seconds on input and 5-10 seconds watching the reveal
- The shareable card is the primary output; the reveal sequence is the primary experience
- Most users generate 1-2 cards per session (their biggest decision, then maybe a second)
- Repeat usage is low (spike-and-die pattern typical for this category) but each visit has high share potential

---

## 5. Core User Flow

### Flow Overview
```
Landing → Input → Pre-fetch → Reveal → Card → Save/Share
```

### Step-by-Step

**Step 1: Landing Page**
Dark, cinematic, single screen. The tagline renders large. One CTA: "Enter your decision." No navigation, no explanation, no about page. The tone does the selling.

**Step 2: Progressive Input Form (Terminal/Mission Briefing Aesthetic)**

Three fields, presented one at a time on mobile (all visible on desktop):

1. **"What was the decision?"** --- free text, max 100 characters. This becomes the hero text on the card.
2. **"When did you face it?"** --- flexible date input accepting exact date, month+year, or year only. Natural language parsing ("June 2019", "2019", "June 14, 2019"). Min: 1950. Max: today. Text input fits terminal aesthetic better than a date picker widget.
3. **"Why did it feel enormous?"** --- optional, max 140 characters. Placeholder: "One word is enough." This field is private and NEVER appears on the shareable card.

Submit button: **"DECLASSIFY"** (not "Submit").
Privacy line beneath: "No account needed. Nothing is stored. This is just yours."

**Step 3: Data Pre-fetch**
API calls begin when the date field is filled, before the user clicks DECLASSIFY. By submit time, data is cached. The reveal sequence has zero network dependency.

**Step 4: Reveal Sequence (5.5 seconds, choreographed)**

| Timestamp | Event |
|-----------|-------|
| T+0ms | Screen goes dark (200ms fade) |
| T+300ms | Timestamp types out: `BRIEFING INITIATED // 2024-03-15` |
| T+800ms | User's decision appears (largest text, typewriter at 40ms/char) |
| T+1500ms | "Meanwhile..." transition (fade in, hold 600ms) |
| T+2100ms | First data point with narrative sentence frame |
| T+2800ms | Second data point |
| T+3500ms | Third data point (ISS + crew names) |
| T+4200ms | Birth/death statistics + Cosmic Significance line |
| T+5000ms | Closing tagline (800ms deliberate delay before appearing) |

Critical rules:
- Never more than 1.2 seconds without a visual change
- `prefers-reduced-motion: reduce` shows full card instantly with 300ms fade
- CSS easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Click-to-skip always available
- First visit only for typewriter effects

**Step 5: Mission Log Card**
Dark background (#0a0e17), IBM Plex Mono for data, IBM Plex Sans for decision text. 4:5 aspect ratio (1080x1350). Layout:

```
+------------------------------------------+
|  MISSION LOG // 2024.03.15               |
|  BRIEFING #00004,271                     |
|                                          |
|  While you were deciding                 |
|  to quit your job...                     |  <- HERO TEXT
|                                          |
|  the ground shook in Morocco (M6.1)      |
|  the ISS passed 254 miles above          |
|  asteroid 2024 FG2 slipped past          |
|                                          |
|  Cosmic significance: 0.0000000%         |
|  To you: immeasurable.                   |
|                                          |
|  The world didn't hold its breath.       |
|  It never does. You decided anyway.      |
|                                          |
|  whileyouweredeciding.com       [DECIDED]|
+------------------------------------------+
```

Key details:
- "DECIDED" stamp: 2-3 degree rotation, subtle red/amber tint
- Briefing number: sequential counter (social proof)
- Subtle grid texture at 3-5% opacity (technical document feel)
- URL watermark: bottom-right, 30% opacity

**Step 6: Save or Share**
- Default: PRIVATE. "Save Briefing" downloads the full card (includes "why" field if provided).
- "Share" flow lets the user EDIT decision text before sharing. The "why" field NEVER appears on the shared version.
- Pre-populated share text with 5 variants the user can pick from.
- No social share button icons cluttering the UI --- just "SAVE BRIEFING" + "COPY LINK."

---

## 6. Key Features

### Feature 1: Narrative Sentence Reframe
Every data point is prefixed with "While you were deciding..." creating a call-and-response rhythm. The ellipsis pause between the user's decision and each fact is where the uncanny feeling lives. This is the single biggest differentiator --- raw data becomes poetry through editorial framing.

### Feature 2: ISS Crew "Witness" Detail
Name the actual astronauts orbiting Earth when the user decided. "Expedition 67. Crew of 7. One of them was Samantha Cristoforetti." This transforms an abstract data point (lat/long) into human presence. It is the detail people describe when telling someone about the app.

### Feature 3: Cosmic Significance Score
"Your decision's cosmic significance: 0.0000000%. But to you: immeasurable." The visual hierarchy is inverted: "immeasurable" is dominant, the percentage is smaller and lighter. This is the screenshot moment --- funny, self-aware, emotionally resonant. Every brainstorm agent independently identified this as the viral trigger.

### Feature 4: Birth/Death Daily Statistics
"385,000 people were born. 170,000 others left. You were somewhere in the middle, deciding." UN demographic data by decade, rendered as static lookup. Adds human scale without API dependency.

### Feature 5: Dynamic OG Tags
When someone shares a link, the preview in iMessage/WhatsApp/Slack shows THEIR personalized card, not a generic image. URL pattern: `/b/{hash}`. Server renders personalized OG image via Satori. The shared link landing page does NOT show the sharer's briefing --- it shows the input form with: "[Someone] got their briefing. Get yours." This is the Wordle mechanic: seeing results creates FOMO, not satisfaction.

### Feature 6: Easter Eggs

| Trigger | Response |
|---------|----------|
| Today's date | "You're deciding right now? Come back when it's done." |
| Future date | "That hasn't happened yet. The record is blank." |
| User's birthday | "That's the day you arrived. Think of it as a debut." |
| Feb 14, 1990 | Pale Blue Dot quote (Voyager 1 photo date) |
| Date before 1950 | "Our instruments can't reach that far back." |
| Empty decision field | "Even indecision is a decision. But we need more." |
| 404 page | "This page doesn't exist. Most of the universe is empty space, and it's doing great." |

### Feature 7: Flexible Date Input
Three precision levels: exact date, month+year, year only. Text input with natural language parsing. Fits the terminal aesthetic and accommodates fuzzy memories ("sometime in 2019").

### Feature 8: Pre-Populated Share Text
Five options the user can pick from, ranging from minimalist to challenge-style. Example: "Look up the day you made your biggest decision. I dare you. The briefing is... a lot."

---

## 7. Narrative Copy System

The app's editorial voice is its primary differentiator. A complete copy system has been authored covering:

- **7 "Meanwhile" transitions** --- bridge from the user's decision to world data, each with a distinct emotional register (quiet awe, wry, tender, cinematic, philosophical, warm, understated)
- **Earthquake frames** --- tiered by magnitude (micro, minor, moderate, strong) with 2 variants each
- **Asteroid frames** --- tiered by miss distance (standard, close, very close) with 2 variants each
- **ISS frames** --- 4 variants incorporating crew, altitude, speed, and nearest country
- **Headline frames** --- 4 variants wrapping Wikipedia events into personal context
- **Perspective lines** --- 4 synthesizing sentences tying all data points together
- **6 closing line variants** --- all ending with the same emotional register: you did it anyway, and that's enough
- **5 "One Line" candidates** --- standalone hero sentences that work with zero context

All copy is randomized using a date-seeded selection so the same date always produces the same variant (shareable cards remain reproducible).

Reference: `/copy/app-copy.js`

---

## 8. Technical Architecture

### Stack
- **Framework:** Next.js on Vercel
- **API layer:** Vercel API routes (server-side, protects keys, eliminates CORS)
- **Card rendering:** Satori + @vercel/og (<100ms per render, edge-compatible)
- **Fonts:** IBM Plex Mono (data), IBM Plex Sans (decision text), Noto Sans (Unicode fallback)

### External APIs

| API | Purpose | Auth | Historical | Reliability |
|-----|---------|------|-----------|-------------|
| Wikipedia On This Day | World events by month/day | None | Month/Day only | High |
| USGS Earthquake | Seismic activity by date | None | Full date range | Very High |
| NASA NEO (Near Earth Objects) | Asteroid passes by date | API key (free) | Full date range | High |
| Where The ISS At | Current ISS position | None | Current only | Moderate |

### Data Strategy

**API calls:** `Promise.allSettled` with 3-second per-API timeout. Every data point has a fallback copy line if its API fails. If all APIs fail: "The universe kept its records sealed that day."

**Caching (in-memory by date):**

| Data | Cache Key | TTL | Notes |
|------|-----------|-----|-------|
| Wikipedia | `wiki:{MM}-{DD}` | Infinite | Only 366 possible keys |
| USGS | `usgs:{YYYY-MM-DD}` | Infinite | Past data never changes |
| NASA NEO | `neo:{YYYY-MM-DD}` | Infinite | Past data never changes |
| ISS Position | `iss:current` | 60 seconds | Only current position available |

**ISS Crew:** Static JSON lookup table mapping date ranges to ISS expedition numbers + crew names. Approximately 150 lines covering 2000-present. No API dependency.

**Birth/Death Rates:** Static lookup table by decade using UN demographic data. No API dependency.

**Content Curation:** Hard cap of 3 world events, 1 earthquake (min magnitude 4.5), 1 asteroid, ISS position. Wikipedia events scored by description length and cultural relevance. Sensitivity keyword filter for traumatic events.

### Content Caps (Card)

| Element | Limit |
|---------|-------|
| Decision text | 100 characters |
| "Why" field | 140 characters (private only) |
| Wikipedia event | 1 event, max 120 chars |
| Earthquake | 1 line summary (largest event) |
| Asteroid | 1 line summary (closest/most notable) |
| ISS | 1 line |

---

## 9. Design Direction

### Visual Language
Declassified mission log / space agency briefing document. Not an infographic. The format IS the differentiation (like Receiptify used receipt format for music data). Monospace data + humanist type for personal decision = visual joke of scale.

### Color Palette
```
--bg-primary:    #0a0e17       Deep space
--bg-surface:    #111827       Card background
--text-primary:  #c8d6e5       Cool gray
--text-heading:  #e8e8e8       Near-white
--accent:        #4ecca3       Mission control teal
--accent-warn:   #e74c3c       Classification red
--border:        rgba(200, 214, 229, 0.12)
```

### Typography
- IBM Plex Mono: data fields, timestamps, briefing numbers
- IBM Plex Sans: decision text, narrative copy, UI elements
- No thin font weights below 20px

### Card Specifications
- Aspect ratio: 4:5 (1080x1350px) --- maximizes Instagram feed + works on Twitter/X
- Dark background stands out in bright social feeds
- Subtle grid texture at 3-5% opacity for technical document feel

### What NOT to Do
- No loading spinner (the reveal animation IS the loading state)
- No social share button icons cluttering the UI
- No card editing after generation (fixedness = authority)
- No auto-playing sound
- No illustrations competing with the data
- No scroll-based narrative

---

## 10. Privacy and Safety

### Sensitivity Handling
- Only show Wikipedia events from OTHER years on that calendar date (Wikipedia returns by month/day, not year --- this is natural behavior)
- Sensitivity keyword filter on Wikipedia descriptions for traumatic events
- If a major tragedy keyword is detected, reframe to: "The world was going through its own enormity"
- Curated blocklist of ~50-100 globally traumatic dates for extra caution

### User Privacy
- "Why did it feel enormous?" NEVER appears on shareable cards --- stays private
- Default card output is PRIVATE (download, no share prompt)
- Share flow lets user EDIT decision text before sharing
- No accounts, no database, no tracking beyond standard Vercel analytics
- Privacy line on input form: "No account needed. Nothing is stored. This is just yours."

### Security
- All API calls server-side (no key exposure in client JS)
- Input sanitized server-side: strip all HTML, use `textContent` not `innerHTML`
- CSP headers
- HTML-encode OG meta tags
- XSS prevention on all user-generated text rendering

---

## 11. Competitive Landscape

### White Space
No direct competitor exists in this intersection:
- **"On This Day" tools** = flat trivia lists, zero emotional framing
- **Decision journals** = serious, private, no shareability
- **Wrapped-style generators** = music/fitness data, not personal decisions
- **Neal.fun** = closest spiritual cousin, but no personal input
- **NASA Hubble Birthday** = single data source, no narrative voice

### Defensible Assets
1. The name "While You Were Deciding"
2. The closing line and narrative voice (treat as brand asset)
3. First-mover on this specific frame (decision + cosmic data + narrative reframe + shareable artifact)
4. Execution quality: the reveal sequence, card design, copy system

### Honest Vulnerabilities
- Technically trivial to clone (4 free APIs, one weekend of work)
- Moat is editorial voice, not technology
- Single-use trajectory: spike-and-die pattern unless retention mechanic is added
- AI-narrated version would be stronger (future threat, but exceeds current constraints)

---

## 12. Viral Loop

```
User visits → enters decision (30s) → sees Mission Log (surprise/delight)
    → one-tap save/share → friends see personalized OG card preview
    → "What is this?" → visit site → generate their own → [repeat]
```

The Wordle mechanic is critical: shared links do NOT show the sharer's briefing. They show the input form with "[Someone] got their briefing. Get yours." Seeing results creates FOMO, not satisfaction.

### Launch Channels
- r/InternetIsBeautiful (proven launchpad for neal.fun-style projects)
- Instagram Stories (dark card stands out in bright feeds)
- TikTok creators in anxiety/self-improvement/space niches
- Twitter/X quote-tweets with the challenge variant: "Look up the day you made your biggest decision. I dare you."

---

## 13. Constraints and Assumptions

### Hard Constraints
- 1-2 day development sprint (16-18 hours total)
- No AI/LLM calls (cost and latency)
- No user accounts or persistent database
- No backend beyond Vercel API routes
- Mini-app challenge entry context
- NASA API key must be registered before development begins (free, instant, 1000 req/hr vs 50/day with DEMO_KEY)

### Assumptions
- Wikipedia On This Day API remains free and stable
- USGS Earthquake API continues to serve historical data without auth
- NASA NEO API free tier (1000 req/hr) is sufficient for challenge traffic
- Users are willing to type a personal decision into a web form
- The 5.5-second reveal sequence is ceremonial, not tedious
- Dark aesthetic stands out rather than alienates on social feeds

---

## 14. Implementation Sprint Plan

### Day 1 (~8-9 hours): Core Experience

| Task | Hours | Priority |
|------|-------|----------|
| Narrative sentence reframe + copy template integration | 4 | CRITICAL |
| Reveal sequence choreography (CSS + JS timing) | 2-3 | CRITICAL |
| ISS crew static JSON lookup table | 1-2 | HIGH |

### Day 2 (~8-9 hours): Share and Polish

| Task | Hours | Priority |
|------|-------|----------|
| Card hierarchy + Satori template rendering | 2 | CRITICAL |
| Dynamic OG tags (personalized link previews) | 1.5 | CRITICAL |
| Pre-populated share text variants | 0.5 | HIGH |
| Copy system integration (all templates from app-copy.js) | 2 | HIGH |
| Landing page entrance + visual polish | 1-2 | MEDIUM |
| Sound effect (if time permits) | 1 | LOW / CUT FIRST |

---

## 15. Open Questions

1. **Domain:** Is `whileyouweredeciding.com` available and registered?
2. **Briefing counter:** How to implement sequential briefing numbers without a database? Options: daily counter in memory (resets on redeploy), or hash-based pseudo-number from date+decision text.
3. **Birthday detection:** How does the app detect a birthday input? Options: ask explicitly in a fourth optional field, or skip birthday detection in v1.
4. **Sound:** The sub-bass reveal hum scored lowest priority. Cut it if Day 2 runs long.
5. **ISS crew data coverage:** The static JSON covers 2000-present. Decisions dated 1950-1999 will not have crew data. Fallback copy needed for pre-ISS dates (ISS launched 1998).

---

## 16. Summary

While You Were Deciding is a 60-second web experience that takes a personal decision and reframes it against the backdrop of cosmic indifference. The product is not a data lookup --- it is an emotional arc delivered through choreographed pacing, narrative sentence framing, and a shareable artifact designed for screenshot culture. The technology is simple (4 free APIs, static lookup tables, Satori card rendering). The differentiation is entirely in editorial voice, reveal choreography, and visual taste. The closing line --- "The world didn't hold its breath. It never does. You decided anyway." --- is the brand asset. Everything else serves it.
