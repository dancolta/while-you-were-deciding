---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - phase-1-brainstorm-synthesis.md
  - phase-2-stress-test-synthesis.md
  - phase-2b-elevation-synthesis.md
workflowType: 'epics-and-stories'
project_name: 'While You Were Deciding — V2 Redesign'
date: '2026-03-04'
---

# V2 Epics & Stories — "While You Were Deciding" Redesign

**Sprint duration:** 1 day (parallel agent execution)
**Team:** 7 agents + 1 team lead
**Stack:** Next.js 15 (App Router), Tailwind CSS 4, IBM Plex Mono/Sans, Vercel

---

## Epic 1: Color Palette + CSS Foundation

### CSS-1: Warm gold-on-deep-purple color palette
- **Priority:** P0 | **Agent:** css-foundation | **Dependencies:** None | **Blocks:** All other epics
- **Description:** Replace cold teal-on-navy palette with warm nocturnal family. Update all CSS custom properties in `app/globals.css`. Each data category gets its own color within a cohesive warm palette.
- **Acceptance Criteria:**
  - [ ] New CSS custom properties: `--bg: #0d0b0e`, `--bg-surface: #1a1520`, `--bg-card: #221c2a`, `--fg: #d4cdd8`, `--fg-heading: #f0eaf5`, `--fg-muted: #8a7f93`, `--accent: #e8c547`, `--accent-glow: rgba(232,197,71,0.15)`, `--accent-warn: #e85d4a`
  - [ ] Category colors: `--quake: #e85d4a`, `--asteroid: #d4a033`, `--orbital: #7ba3d4`, `--timeline: #c4a0e8`, `--life: #72c49a`, `--death: #c47272`
  - [ ] `--border: rgba(200, 180, 220, 0.1)`
  - [ ] No leftover teal/green from old palette

### CSS-2: Typography utility classes (three voices)
- **Priority:** P0 | **Agent:** css-foundation | **Dependencies:** CSS-1
- **Description:** Add utility classes for three typographic voices: Instrument (Plex Mono 9-12px, uppercase, tracked), Narrative (Plex Sans 18-48px, light-regular), Impact (Plex Mono 48-96px, bold, tabular-nums). Add `clamp()` for responsive impact sizes.
- **Acceptance Criteria:**
  - [ ] `.instrument` — Plex Mono, 9-12px, weight 400-500, uppercase, letter-spacing 0.1em
  - [ ] `.narrative` — Plex Sans, 18-48px, weight 300-600
  - [ ] `.impact-number` — Plex Mono, `font-size: clamp(48px, 10vw, 96px)`, weight 700, `font-variant-numeric: tabular-nums`
  - [ ] IBM Plex Sans weight 300 added to `app/layout.tsx` font import

### CSS-3: Animation keyframes library
- **Priority:** P0 | **Agent:** css-foundation | **Dependencies:** CSS-1
- **Description:** New keyframes replacing uniform `opacity 0.5s ease-out`. Section labels: instant (150ms). Data numbers: count-up spring. SVG: stroke-dashoffset deceleration. Text blocks: fade+translateY(12px) 400ms. Large reveals: scale 0.95→1.0 + blur(4px)→blur(0). Progress: spring stagger.
- **Acceptance Criteria:**
  - [ ] `@keyframes fadeSlideUp` — opacity + translateY(12px), 400ms, `cubic-bezier(0.16, 1, 0.3, 1)`
  - [ ] `@keyframes scaleBlurIn` — scale 0.95→1.0 + blur(4px)→blur(0), 600ms spring
  - [ ] `@keyframes springPop` — scale 0→1.0, `cubic-bezier(0.34, 1.56, 0.64, 1)`, 200ms
  - [ ] `@keyframes svgDraw` — stroke-dashoffset deceleration, 1-2s
  - [ ] `.significance-warm-bloom` radial gradient class
  - [ ] `prefers-reduced-motion` media query disables all keyframes

---

## Epic 2: Landing Page Redesign

### LANDING-1: Example preview card ("Show Don't Tell")
- **Priority:** P0 | **Agent:** landing-page | **Dependencies:** Epic 1
- **Description:** Add cycling example result above the form so users instantly understand the payoff. Preview card at 30-40% opacity, cycles 2-3 example decisions on 8s fade interval. Shows abbreviated cosmic data + "immeasurable" punchline.
- **Acceptance Criteria:**
  - [ ] Preview card component with muted styling (30-40% opacity)
  - [ ] 3 example decisions cycling on 8s interval with crossfade
  - [ ] Example includes: cosmic event, asteroid data, birth/death count, "Cosmic significance: 0.0000000% / To you: immeasurable."
  - [ ] Preview positioned above the input form
  - [ ] Does not interfere with form interaction

### LANDING-2: Input form warm redesign
- **Priority:** P0 | **Agent:** landing-page | **Dependencies:** LANDING-1
- **Description:** Remove bracket syntax from buttons. Add rotating placeholder text in decision input. Warm gold palette. "Show me what happened" button properly styled (no brackets).
- **Acceptance Criteria:**
  - [ ] Button text: "Show me what happened" (no brackets)
  - [ ] Rotating placeholders: "to quit my job", "to say yes", "to move across the country"
  - [ ] Gold accent colors on interactive elements
  - [ ] "Today" pill button next to date input

### LANDING-3: Logo recolor
- **Priority:** P0 | **Agent:** landing-page | **Dependencies:** Epic 1
- **Description:** Rewrite `components/Logo.tsx` to use gold accent (`--accent: #e8c547`) instead of teal.
- **Acceptance Criteria:**
  - [ ] Logo uses `var(--accent)` gold color
  - [ ] No teal/green remnants

---

## Epic 3: 6-Slide Consolidation

### SLIDES-1: StorySequence rewrite (6 slides)
- **Priority:** P0 | **Agent:** story-architect | **Dependencies:** Epic 1
- **Description:** Rewrite `components/StorySequence.tsx` to render 6 slides: Anchor, Headline, Space, Timeline, Demographics, Significance. Add IntersectionObserver for currentSlide tracking. Remove old 8-slide structure.
- **Acceptance Criteria:**
  - [ ] 6 scroll-snap slides in order: Anchor → Headline → Space → Timeline → Demographics → Significance
  - [ ] IntersectionObserver tracks `currentSlide` index
  - [ ] `currentSlide` exposed via state/context for ProgressRail
  - [ ] Scroll-snap-type: y mandatory on container

### SLIDES-2: HeadlineSlide (strongest data point)
- **Priority:** P0 | **Agent:** story-architect | **Dependencies:** SLIDES-1
- **Description:** Rename EarthquakeSlide → HeadlineSlide. Leads with the MOST dramatic data point: earthquake (if significant) OR asteroid (if closer) OR strongest Wikipedia event. Dynamic selection logic.
- **Acceptance Criteria:**
  - [ ] Selects strongest data point by: earthquake magnitude > 5.5 wins, else closest asteroid, else top Wikipedia event
  - [ ] Displays with appropriate category color (quake red, asteroid amber, or timeline violet)
  - [ ] Full-width visualization matching the data type
  - [ ] Graceful fallback chain: earthquake → asteroid → Wikipedia → generic "the world kept turning"

### SLIDES-3: SpaceSlide (merged asteroid + ISS)
- **Priority:** P0 | **Agent:** story-architect | **Dependencies:** SLIDES-1
- **Description:** New combined slide merging AsteroidSlide + ISSSlide. Top section: asteroid flyby data with trajectory visualization. Bottom section: world map with animated ISS dot + crew info. Orbital blue accent.
- **Acceptance Criteria:**
  - [ ] Asteroid section: name, size comparison, speed, miss distance
  - [ ] ISS section: world map with animated orbital arc, crew count, notable crew member
  - [ ] Blue radial gradient background (`--orbital`)
  - [ ] Graceful handling when asteroid data is null (show only ISS)
  - [ ] Delete old `AsteroidSlide.tsx` and `ISSSlide.tsx`

### SLIDES-4: page.tsx phase handling update
- **Priority:** P0 | **Agent:** story-architect | **Dependencies:** SLIDES-1
- **Description:** Update `app/page.tsx` to handle overlay briefing card (modal, not scroll destination). Remove old slide-count assumptions.
- **Acceptance Criteria:**
  - [ ] Briefing card triggered as overlay/modal, not as a slide
  - [ ] Phase transitions work with new 6-slide structure
  - [ ] No references to deleted slide components

---

## Epic 4: SVG Visualizations

### SVG-1: Full-width seismograph with multi-trace
- **Priority:** P0 | **Agent:** svg-artist | **Dependencies:** Epic 1
- **Description:** Rewrite `SeismographLine.tsx`. Remove max-width caps. Full-width SVG. Add overlapping P-wave trace at 50% opacity behind main S-wave trace. Stroke-dashoffset draw animation.
- **Acceptance Criteria:**
  - [ ] SVG fills 80%+ of viewport width
  - [ ] P-wave trace: lower amplitude, 50% opacity, lighter color
  - [ ] S-wave trace: main trace, full opacity, `--quake` color
  - [ ] `stroke-dashoffset` animation on entry (1.5s deceleration)
  - [ ] Magnitude number displayed at `clamp(48px, 10vw, 96px)`, not in a tiny ring

### SVG-2: World map with ISS orbital arc
- **Priority:** P0 | **Agent:** svg-artist | **Dependencies:** Epic 1
- **Description:** Rewrite `WorldMapOutline.tsx`. Better simplified coastline paths. ISS dot animates along a partial orbital arc (not just pulsing in place). Full-width.
- **Acceptance Criteria:**
  - [ ] Improved coastline paths (cleaner, more recognizable)
  - [ ] ISS dot moves along sinusoidal orbital path over ~3s
  - [ ] Orbit path drawn with dashed line at 30% opacity
  - [ ] SVG fills 80%+ of viewport width
  - [ ] Warm color scheme (`--orbital` blue)

### SVG-3: MagnitudeRing warm recolor
- **Priority:** P1 | **Agent:** svg-artist | **Dependencies:** Epic 1
- **Description:** Rewrite `MagnitudeRing.tsx` with warm colors. Larger display. Gold/red palette instead of teal.
- **Acceptance Criteria:**
  - [ ] Uses `--quake` and `--accent` colors
  - [ ] No max-width cap
  - [ ] Ring animation uses spring easing

### SVG-4: Delete AsteroidComparison.tsx
- **Priority:** P0 | **Agent:** svg-artist | **Dependencies:** None
- **Description:** Delete `components/svg/AsteroidComparison.tsx`. Functionality moves inline into SpaceSlide.
- **Acceptance Criteria:**
  - [ ] File deleted
  - [ ] No remaining imports anywhere

---

## Epic 5: Slide Components (Anchor, Timeline, Demographics)

### COMP-1: AnchorSlide warm redesign
- **Priority:** P0 | **Agent:** slide-builder | **Dependencies:** Epic 1
- **Description:** Rewrite `AnchorSlide.tsx`. User's decision text displayed big and bold using narrative voice. Date in instrument voice. "Meanwhile..." line below. Warm gold radial gradient background.
- **Acceptance Criteria:**
  - [ ] Decision text: Plex Sans, `clamp(24px, 5vw, 48px)`, weight 300-400
  - [ ] Date: Plex Mono, 10-12px, uppercase, tracked
  - [ ] "While you were deciding..." intro line
  - [ ] Warm gold radial gradient: `rgba(232,197,71,0.06)` at center
  - [ ] Fade + translateY(12px) entrance animation

### COMP-2: TimelineSlide violet redesign
- **Priority:** P0 | **Agent:** slide-builder | **Dependencies:** Epic 1
- **Description:** Rewrite `TimelineSlide.tsx`. Max 2 Wikipedia events + user's decision as highlighted final node. Violet accent. Vertical timeline with connecting line.
- **Acceptance Criteria:**
  - [ ] Maximum 2 Wikipedia events displayed
  - [ ] User's decision appears as final node, highlighted in gold
  - [ ] Vertical timeline with connecting line in `--timeline` violet
  - [ ] Each node: year label (instrument voice) + event text (narrative voice)
  - [ ] Violet radial gradient background

### COMP-3: DemographicsSlide massive numbers
- **Priority:** P0 | **Agent:** slide-builder | **Dependencies:** Epic 1
- **Description:** Rewrite `DemographicsSlide.tsx`. Births and deaths as massive count-up numbers at impact voice scale. Split color background: green left, rose right.
- **Acceptance Criteria:**
  - [ ] Birth count: `clamp(48px, 10vw, 96px)` Plex Mono bold, `--life` green
  - [ ] Death count: same scale, `--death` rose
  - [ ] Count-up animation via `useCountUp` hook
  - [ ] Labels in instrument voice below each number
  - [ ] Split radial gradient background: green glow left, rose glow right

### COMP-4: LoadingTransition warm palette
- **Priority:** P1 | **Agent:** slide-builder | **Dependencies:** Epic 1
- **Description:** Update `LoadingTransition.tsx` with warm palette colors.
- **Acceptance Criteria:**
  - [ ] Uses `--accent` gold and `--bg` warm near-black
  - [ ] No teal/green remnants

### COMP-5: ShareControls warm palette
- **Priority:** P1 | **Agent:** slide-builder | **Dependencies:** Epic 1
- **Description:** Update `ShareControls.tsx` with warm palette colors.
- **Acceptance Criteria:**
  - [ ] Uses `--accent` gold for primary actions
  - [ ] Uses warm palette throughout

---

## Epic 6: Significance Slide — Three-Phase Dramatic Build

### SIG-1: Phase 1 — Cold insignificance (0-1.5s)
- **Priority:** P0 | **Agent:** punchline | **Dependencies:** Epic 1
- **Description:** Dark slide. "Cosmic significance:" fades in tiny at top in instrument voice. Long pause. Cold feel.
- **Acceptance Criteria:**
  - [ ] "Cosmic significance:" in instrument voice (Plex Mono, 10-12px, uppercase)
  - [ ] Positioned at top center
  - [ ] Fade-in over 500ms, then hold

### SIG-2: Phase 2 — The number (1.5-3s)
- **Priority:** P0 | **Agent:** punchline | **Dependencies:** SIG-1
- **Description:** "0.0000000%" appears HUGE with decrypt/scramble effect. Centered. Cold and insignificant feel. Impact voice at `clamp(40px, 8vw, 72px)`.
- **Acceptance Criteria:**
  - [ ] "0.0000000%" in impact voice, centered
  - [ ] Decrypt effect: random characters cycling → settling to final value
  - [ ] Cold color (`--fg-muted` or similar)
  - [ ] Duration: ~1s for decrypt to settle

### SIG-3: Phase 3 — Warm bloom / emotional turn (3-5s)
- **Priority:** P0 | **Agent:** punchline | **Dependencies:** SIG-2
- **Description:** Everything above dims to 20% opacity. Warm gold radial gradient blooms from center. "To you:" small, then "immeasurable." character by character in warm gold at 60-80px. Subtle glow. Background color temperature shifts.
- **Acceptance Criteria:**
  - [ ] Previous content dims to 20% opacity
  - [ ] Radial gradient bloom: `rgba(232,197,71,0.08)` expanding from center
  - [ ] "To you:" in instrument voice, centered
  - [ ] "immeasurable." character-by-character reveal in narrative voice, gold color, 60-80px
  - [ ] Text-shadow glow behind "immeasurable."
  - [ ] Closing line fades in below
  - [ ] Share/briefing button appears last

---

## Epic 7: UI Components (Progress Rail + Briefing Overlay)

### UI-1: ProgressRail vertical indicator
- **Priority:** P0 | **Agent:** ui-components | **Dependencies:** Epic 1
- **Description:** Create `components/ProgressRail.tsx`. Vertical pip indicator fixed on right edge of viewport. Active pip stretches taller. Gold accent.
- **Acceptance Criteria:**
  - [ ] Fixed position: right-3, vertically centered
  - [ ] 6 pips (one per slide)
  - [ ] Active pip: 20px tall, gold (`--accent`), opacity 1
  - [ ] Inactive pips: 6px tall, muted, opacity 0.2
  - [ ] Smooth transition on pip change (300ms)
  - [ ] z-index above slides but below modals
  - [ ] Accepts `currentSlide` prop

### UI-2: BriefingCard overlay modal
- **Priority:** P0 | **Agent:** ui-components | **Dependencies:** Epic 1
- **Description:** Rewrite `BriefingCard.tsx` as centered overlay/modal (not scroll slide). Triggered by button on Significance slide. Warm palette: gold accent, `--bg-card` background. Backdrop blur. Clean for screenshots.
- **Acceptance Criteria:**
  - [ ] Renders as fixed-position centered modal with backdrop
  - [ ] Backdrop: semi-transparent dark with blur
  - [ ] Card uses `--bg-card` background, `--accent` gold accents
  - [ ] Close button (X) and click-outside-to-close
  - [ ] Transition: scale 0.95→1.0 + opacity fade, 300ms
  - [ ] Clean layout optimized for screenshot/sharing
  - [ ] Escape key closes modal

---

## Epic 8: UX QA — End-to-End Design Audit & Iteration

### UX-1: First impression audit (5-second test)
- **Priority:** P0 | **Agent:** ux-qa | **Dependencies:** Epics 2-7 complete
- **Description:** Evaluate landing page from the perspective of an overwhelmed, distracted user. Does the example preview immediately communicate what the app does? Would a busy person stop scrolling?
- **Acceptance Criteria:**
  - [ ] Landing page communicates purpose within 5 seconds
  - [ ] Example preview is compelling and not confusing
  - [ ] Visual hierarchy guides the eye correctly
  - [ ] No cognitive overload — clean, focused entry point

### UX-2: Full interaction click-through
- **Priority:** P0 | **Agent:** ux-qa | **Dependencies:** UX-1
- **Description:** Click/tap every interactive element. Test: date input edge cases, placeholder rotation, "Today" pill, form validation states, submit button disabled/enabled/loading states, scroll-snap between all 6 slides, progress rail accuracy, briefing card modal (open/close/escape/click-outside), share controls, download.
- **Acceptance Criteria:**
  - [ ] Every button, input, and interactive element works correctly
  - [ ] No dead clicks, broken states, or missing hover/focus styles
  - [ ] Tab order is logical
  - [ ] Error states are clear and helpful
  - [ ] Modal interactions (close, escape, click-outside) all work

### UX-3: Flow friction analysis
- **Priority:** P0 | **Agent:** ux-qa | **Dependencies:** UX-2
- **Description:** Identify every moment where a user might: get confused, lose interest, not know what to do next, feel the pace is too slow/fast. Check animation timing feels right, not tedious on repeat visits. Assess if the emotional arc builds correctly across slides.
- **Acceptance Criteria:**
  - [ ] No moment where user is stuck wondering "what do I do now?"
  - [ ] Animation timing feels intentional, not tedious
  - [ ] Scroll-snap transitions are smooth, not jarring
  - [ ] Progress rail gives adequate orientation
  - [ ] Significance slide punchline lands as emotional turn

### UX-4: Mobile experience validation (390px)
- **Priority:** P0 | **Agent:** ux-qa | **Dependencies:** UX-2
- **Description:** Full flow on 390px viewport. No horizontal overflow, no tiny tap targets (<44px), no cut-off text. Progress rail doesn't obstruct content. Impact numbers responsive and readable.
- **Acceptance Criteria:**
  - [ ] No horizontal scroll on any slide
  - [ ] All tap targets >= 44px
  - [ ] Text doesn't overflow or get cut off
  - [ ] Progress rail visible but not obstructing
  - [ ] Impact numbers scale correctly via clamp()

### UX-5: Iterate and fix until 90% engagement confidence
- **Priority:** P0 | **Agent:** ux-qa (spawns fix agents as needed) | **Dependencies:** UX-1 thru UX-4
- **Description:** For every issue found in UX-1 through UX-4, implement the fix directly. Don't just report — fix. Multiple rounds of test→fix→retest. Continue until the flow would keep 90%+ of first-time visitors engaged through to the briefing card. Focus on: removing friction, improving clarity, tightening timing, polishing micro-interactions.
- **Acceptance Criteria:**
  - [ ] All issues from UX-1 thru UX-4 resolved
  - [ ] At least 2 full test→fix→retest cycles completed
  - [ ] Final assessment: flow keeps overwhelmed user engaged through entire sequence
  - [ ] No remaining "I'd bounce here" moments

---

## Dependency Graph

```
Epic 1: CSS Foundation (css-foundation agent)
  ├── Epic 2: Landing Page (landing-page agent)
  ├── Epic 3: 6-Slide Consolidation (story-architect agent)
  ├── Epic 4: SVG Visualizations (svg-artist agent)
  ├── Epic 5: Slide Components (slide-builder agent)
  ├── Epic 6: Significance Slide (punchline agent)
  └── Epic 7: UI Components (ui-components agent)
                    │
                    ▼
        Epic 8: UX QA (ux-qa agent)
                    │
                    ▼
          Final Integration (team lead)
```

Epics 2-7 run in parallel after Epic 1 completes.
Epic 8 runs after Epics 2-7 complete (needs full UI to test).
Final integration runs last.

---

## Agent Assignment Summary

| Agent | Epic | Stories | Key Files |
|-------|------|---------|-----------|
| **css-foundation** | 1 | CSS-1, CSS-2, CSS-3 | `globals.css`, `layout.tsx` |
| **landing-page** | 2 | LANDING-1, LANDING-2, LANDING-3 | `InputForm.tsx`, `Logo.tsx` |
| **story-architect** | 3 | SLIDES-1, SLIDES-2, SLIDES-3, SLIDES-4 | `StorySequence.tsx`, `HeadlineSlide.tsx`, `SpaceSlide.tsx`, `page.tsx` |
| **svg-artist** | 4 | SVG-1, SVG-2, SVG-3, SVG-4 | `svg/SeismographLine.tsx`, `svg/WorldMapOutline.tsx`, `svg/MagnitudeRing.tsx` |
| **slide-builder** | 5 | COMP-1 thru COMP-5 | `AnchorSlide.tsx`, `TimelineSlide.tsx`, `DemographicsSlide.tsx`, `LoadingTransition.tsx`, `ShareControls.tsx` |
| **punchline** | 6 | SIG-1, SIG-2, SIG-3 | `SignificanceSlide.tsx` |
| **ui-components** | 7 | UI-1, UI-2 | `ProgressRail.tsx` (new), `BriefingCard.tsx` |
| **ux-qa** | 8 | UX-1 thru UX-5 | All files (read + fix) |
| **team lead** | Integration | Build verification, cleanup | All files |

---

## Verification Checklist

- [ ] `npm run build` — clean TypeScript build
- [ ] Landing page: example preview communicates app purpose within 5 seconds
- [ ] Full flow: date → decision → submit → 6 slides → briefing card overlay
- [ ] Null data: null asteroid + null earthquake → headline slide uses Wikipedia gracefully
- [ ] Mobile (390px): scroll-snap works, progress rail visible, impact numbers responsive
- [ ] Significance punchline: warm gold bloom creates visible emotional shift
- [ ] Screenshot test: briefing card looks good when screenshotted
- [ ] `prefers-reduced-motion`: all animations skip gracefully
- [ ] Color consistency: no leftover teal/green from old palette
