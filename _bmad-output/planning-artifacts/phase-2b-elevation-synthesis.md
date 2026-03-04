# Phase 2B: Elevation Synthesis — From 7.5 to 9+/10

## THE 8 CHANGES THAT MAKE THIS UNFORGETTABLE
*Ordered by impact. Total dev budget: ~16-18 hours across 2 days.*

---

### 1. NARRATIVE REFRAME: "While you were deciding..." Sentence Structure (4 hrs)
**The single biggest upgrade.** Instead of listing raw data, every data point gets prefixed with the user's own words in a call-and-response rhythm:

```
While you were deciding whether to quit your job...

...the ground shook 4,200 miles away in Kabul. Magnitude 5.9.
  You didn't feel it. You had other things on your mind.

...an asteroid the size of a city bus passed closer to Earth
  than the Moon, and nobody noticed.

...the International Space Station crossed directly over
  your timezone at 17,400 mph.
```

The **ellipsis pause** between the user's decision and each fact is where the uncanny feeling lives. Implementation: staggered `setTimeout` on pre-templated sentence fragments. No AI needed.

**Template logic:**
- Earthquakes: distance from user's timezone (infer via `Intl.DateTimeFormat`)
- Asteroids: relatable units ("closer than the Moon" / "X times the distance to the Moon")
- ISS: humanized position ("above the Indian Ocean" not lat/long)
- Headlines: pick the most tonally contrasting headline to the user's decision

---

### 2. THE ISS CREW "WITNESS" DETAIL (2-3 hrs)
**The thing nobody else would think of.** Name the actual people orbiting Earth when the user decided.

If ISS ground track was near the user's region:
> "...the International Space Station passed directly overhead. Someone aboard could have looked down and seen your city."

If not:
> "Expedition 67. Crew of 7. Orbiting 253 miles up. One of them was Samantha Cristoforetti. She was probably looking out the cupola window."

**Implementation:** A JSON lookup table mapping date ranges to ISS expedition numbers + crew names. ~150 lines of static data covering 2000-present. Cross-reference ISS lat/long against user's timezone region.

This transforms an abstract data point (lat/long) into a **human presence.** It's the detail people describe when telling someone about the app.

---

### 3. REVEAL SEQUENCE CHOREOGRAPHY (2-3 hrs)
**The pacing IS the product.** Frame-by-frame timing:

```
T+0ms      Screen goes dark (200ms fade)
T+300ms    Timestamp types out: BRIEFING INITIATED // 2024-03-15
T+800ms    User's decision appears (largest text, typewriter, 40ms/char)
T+1500ms   "Meanwhile..." beat (fade in, hold 600ms)
T+2100ms   First data point fades in with sentence frame
T+2800ms   Second data point
T+3500ms   Third data point (ISS + crew)
T+4200ms   Cosmic Significance line
T+5000ms   Closing tagline fades in (800ms delay before, deliberate)
```

**Total: ~5.5 seconds.** Each element gets its own cognitive moment.

**Critical rules:**
- Never >1.2 seconds without a visual change
- `prefers-reduced-motion`: show everything instantly with 300ms fade
- All data pre-fetched before animation starts (zero network dependency during reveal)
- CSS `ease-out` curve: `cubic-bezier(0.16, 1, 0.3, 1)`

---

### 4. CARD HIERARCHY REFRAME (2 hrs)
**The user is the protagonist, not the cosmos.** The shareable card layout:

```
+------------------------------------------+
|  MISSION LOG // 2024.03.15               |
|  BRIEFING #00004,271                     |
|                                          |
|  While you were deciding                 |
|  to quit your job...                     |  ← HERO TEXT
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
|  whileyouweredeciding.com        [DECIDED]|
+------------------------------------------+
```

Key changes:
- Decision text = largest, most prominent
- Cosmic data = abbreviated sentence form (same as reveal), not raw data
- "DECIDED" stamp: 2-3° rotation, subtle red/amber tint
- Briefing number: sequential counter (social proof)
- URL watermark: subtle but always present

---

### 5. TEMPLATED NARRATIVE COPY (2 hrs)

**"Meanwhile" transitions (rotate randomly, seeded by date):**
1. "You were not aware of any of this. Nobody expected you to be."
2. "None of this paused for you. Nothing ever does."
3. "The cosmos did not consult you. It rarely does."
4. "Here is what it looked like from the outside."
5. "You were a little preoccupied."

**Data framing sentences:**

**Earthquake (tiered by magnitude):**
- M4.5-5.5: "The ground shifted in {location} — magnitude {mag}, {distance} miles from where you were sitting. You didn't feel it. You had other things on your mind."
- M5.5-7.0: "A magnitude {mag} earthquake shook {location}. {distance} miles from where you stood. The Earth was restless. So were you."
- M7.0+: "The ground broke open in {location}. Magnitude {mag}. The Earth does not ask permission either."

**Asteroid:**
- "Asteroid {name}, roughly the size of {size_comparison}, was traveling at {speed} mph — {distance_comparison}. The astronomer who spotted it did not know your name."

**ISS:**
- "The International Space Station was {distance} miles above {nearest_country}. {crew_count} humans — orbiting at 17,400 mph. None of them knew what you were deciding."

**Perspective line (card bottom, one per card):**
- "{orbits} orbits. {quake_count} earthquakes. One asteroid. One decision. Everything happened at once. Only one of these things was yours."
- "While you were deciding, the Earth traveled {miles} miles through space. It does that. So do you."

**Closing line variants (5-7, rotate):**
1. "The world didn't hold its breath. It never does. You decided anyway." *(primary)*
2. "Nothing stopped. Everything continued. Including you."
3. "The universe was busy. You decided anyway. That's the whole story."
4. "Everything kept going. You still decided. That's the whole story."
5. "Cosmic indifference isn't cruelty. It's permission."

---

### 6. DYNAMIC OG TAGS (1.5 hrs)
**Highest-impact share mechanic.** When someone shares a link, the preview in iMessage/WhatsApp/Slack shows THEIR card, not a generic image.

- URL pattern: `whileyouweredeciding.com/b/{hash}`
- Server renders personalized OG image via Satori
- This alone could double share-through rate

**Shared link landing page:** Do NOT show the sharer's briefing. Show the input form with:
> "[Someone] got their briefing. Get yours."

This is the Wordle mechanic — seeing results creates FOMO, not satisfaction.

---

### 7. PRE-POPULATED SHARE TEXT (30 min)
Five options the user can pick from:

**Default (The Minimalist):**
> March 15, 2024: The day I [said yes]. Here is what else happened. whileyouweredeciding.com

**Twitter/X (The Challenge):**
> Look up the day you made your biggest decision. I dare you. The briefing is... a lot. whileyouweredeciding.com

---

### 8. OPTIONAL: SINGLE REVEAL SOUND (1 hr, cut first if over budget)
One sound only: a low, resonant hum (0.8 seconds) at the moment of first reveal. Sub-bass, felt more than heard.
- Off by default, small speaker icon toggle
- Single pre-rendered `.mp3`, 15 lines of code
- Creates Pavlovian recall in screen recordings

---

## IMPLEMENTATION SPRINT

### Day 1 (~8-9 hrs): Core Experience
| Task | Hours | Impact |
|------|-------|--------|
| Narrative sentence reframe + templates | 4 | CRITICAL |
| Reveal sequence choreography | 2-3 | CRITICAL |
| ISS crew lookup table | 1-2 | HIGH |

### Day 2 (~8-9 hrs): Share & Polish
| Task | Hours | Impact |
|------|-------|--------|
| Card hierarchy + Satori template | 2 | CRITICAL |
| Dynamic OG tags | 1.5 | CRITICAL |
| Pre-populated share text | 0.5 | HIGH |
| Copy integration (all templates) | 2 | HIGH |
| Landing page entrance + polish | 1-2 | MEDIUM |
| Sound (if time) | 1 | LOW |

---

## THE VERDICT

**Before these changes:** A well-executed "on this day" lookup with a cool aesthetic. 7.5/10.

**After these changes:** A personal existential experience that makes people feel seen, slightly awed, and compelled to share. The narrative reframe ("While you were deciding...the ground shook...you didn't feel it...you had other things on your mind") transforms raw data into poetry. The ISS crew detail gives people something to talk about. The choreographed reveal creates a cinematic moment. The card makes the user the protagonist.

**Projected rating: 9/10.** The remaining 1 point comes from execution quality — timing, typography, the gap between "this looks good" and "this feels inevitable."
