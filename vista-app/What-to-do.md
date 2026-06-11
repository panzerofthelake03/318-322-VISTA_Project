# What To Do

Action plan for completing ID322 & CENG318 Collaborative Assignment II. Tasks are organized by priority and grouped by deliverable.

---

## Phase 1 — Refinement & Research (Do First)

These items unlock everything else. Don't start the videos or final report before these are done.

### 1.1 Refine the Persona

The existing Melis Erten persona is good but lacks **explicit interface interaction needs**. Add a new section translating her traits into specific design requirements.

- [ ] Add "Interaction Needs" section to the persona, mapping traits → interface requirements. Examples:
  - Operational anxiety → needs glanceable air quality status
  - Nighttime baby care → needs one-handed operation, dark/dim screens
  - "Control freak" trait → needs granular control + detailed statistics
  - Skeptical consumer → needs transparent data (graphs, sources)
  - Floor-level sensitivity concern → needs PM2.5 specifically highlighted
- [ ] Add a "Context of Use" subsection (when/where she opens the app — nighttime check, during nap, when leaving house)
- [ ] Keep the existing visual format but add these new layers

### 1.2 Create the Mood Board

At least one mood board per product (smartphone + watch share one, or separate boards).

- [ ] Collect reference images: soft pastel palettes, medical-grade clean aesthetics, baby-room photography, trustworthy typography samples
- [ ] Include color swatches matching your Figma palette (coral, green, mustard, cream)
- [ ] Include material/texture references for the physical product (matte plastic, soft-touch surfaces, fabric grilles)
- [ ] Annotate why each cluster of images matches Melis (e.g., "calming = reduces operational anxiety")
- [ ] Use Figma, Canva, or Milanote — keep it visual, minimal text

### 1.3 Create the Storyboard

Show a real scenario in 6–8 panels demonstrating physical product use and app interaction.

- [ ] Pick a strong scenario. Suggested: Melis hears baby fussing at 2 AM → checks watch → sees red air quality alert → taps Baby Mode → purifier silently activates → baby settles → next morning she reviews statistics on the phone
- [ ] Each panel: simple sketch + caption explaining what's happening + what Melis is feeling/thinking
- [ ] Show both the physical product AND the digital interface (watch + phone) interacting
- [ ] Stick figures are fine — focus on story, not art
- [ ] This is required to be in the PDF report

### 1.4 Build the Experience Map / Interaction Map

The existing flowchart is purely navigational. The new version needs emotional and contextual layers.

- [ ] Create a horizontal experience map with these rows:
  - **Phases** (Discover problem → Onboarding → Daily use → Alert event → Maintenance)
  - **User actions** (what Melis does)
  - **Touchpoints** (phone, watch, physical device)
  - **Thoughts** (what she's thinking)
  - **Emotions** (line graph — frustration, relief, confidence)
  - **Pain points** (where things go wrong)
  - **Opportunities** (where your design helps)
- [ ] Build in Figma, Miro, or Figjam
- [ ] Reference this in the report and link to it

---

## Phase 2 — Interface Refinement (Figma)

### 2.1 Padding & Spacing Audit (Smartphone)

The assignment explicitly flags this. Go through every frame.

- [ ] Set consistent edge padding (16pt or 20pt minimum from screen edges)
- [ ] Set consistent spacing between interactive elements (minimum 8pt gap)
- [ ] Verify minimum tap target size: 44×44pt
- [ ] Check the alert state (red/coral) screen — ensure contrast remains usable when full background is colored
- [ ] Verify bottom nav stays within thumb zone

### 2.2 Padding & Spacing Audit (Smartwatch)

Watch screens are unforgiving — small errors are very visible.

- [ ] Check 3- and 4-column button grids — confirm each button is at least 36×36pt (Apple Watch min) or 40×40pt (Wear OS recommended)
- [ ] Ensure text remains readable at actual watch size (don't trust the zoomed Figma view — preview at 100%)
- [ ] Confirm color-coded air quality states (green/yellow/red/blue) have enough contrast in each variant
- [ ] Reduce screen count by removing pure state-variants from the "main screens" list — keep them but label them as variants

### 2.3 Apply Norman & Nielsen Heuristics Explicitly

The assignment specifies this. Document where each heuristic is applied in the report.

- [ ] **Visibility of system status** — air quality color-coding, filter health bars, mode indicators
- [ ] **Match between system and real world** — "Baby Mode" naming, plain language, no jargon
- [ ] **User control & freedom** — undo for mode changes, back navigation, skip option in onboarding
- [ ] **Consistency & standards** — same icon system across phone and watch, same color tokens
- [ ] **Error prevention** — Child Lock prevents accidental changes; confirm dialogs on destructive actions
- [ ] **Recognition over recall** — chip-based sensitivities selection; visual mode icons
- [ ] **Flexibility & efficiency** — quick actions on watch, "Suggested Action" engine for novices
- [ ] **Aesthetic & minimalist design** — clean dashboard, whitespace
- [ ] **Help users recognize/recover from errors** — clear filter alert messages with action
- [ ] **Help & documentation** — accessible from settings
- [ ] Add Norman's principles too: **affordance, signifier, mapping, feedback, constraint** — map each to specific UI elements

### 2.4 Verify Child Lock is Discoverable

Critical safety feature for the persona — must be reachable.

- [ ] Confirm Child Lock has a clear entry point from Control page
- [ ] Confirm it's mentioned in onboarding or first-run tips
- [ ] Document it explicitly in the report

### 2.5 Prepare Working Prototype

- [ ] Add Figma interactions/transitions between frames (not just static screens)
- [ ] Create separate prototype flows for phone and watch
- [ ] Get shareable view-only links for both
- [ ] Test the prototype yourself end-to-end before sharing

---

## Phase 3 — Industrial Design Integration

ID students' work must appear in the report. This is a workload-distribution issue flagged by the assignment.

- [ ] Industrial Design teammates contribute:
  - Physical product renders (front, side, top views)
  - Materials and finish specifications
  - Physical interface elements (buttons, knobs, indicator LEDs)
  - Form rationale (why this shape suits a nursery)
  - Safety considerations (rounded corners, weight, stability for crawling baby)
- [ ] Include CAD/sketch images in the process report
- [ ] Connect physical design to mood board language

---

## Phase 4 — Demo Videos

### 4.1 Smartphone Demo Video

- [ ] Write narration script before recording (don't improvise)
- [ ] Script structure: introduce Melis → show scenario problem → walk through app solution → close with outcome
- [ ] Record screen capture from Figma prototype (or screen-record from a phone mockup)
- [ ] Add voiceover (Turkish or English — match what your group will present in)
- [ ] Keep it short — 2–4 minutes is plenty
- [ ] Export as MP4

### 4.2 Smartwatch Demo Video

- [ ] Separate video, separate script
- [ ] Focus on a different scenario than the phone video (e.g., quick glance + mode toggle during nap) so they complement each other
- [ ] Show the watch face transitions, color-coded states
- [ ] Same narration approach, same length target

---

## Phase 5 — Reports

### 5.1 Process Report (PDF)

Build on the existing April 12 report. Mark all new and changed sections.

- [ ] Cover page (update with Assignment II header and current date)
- [ ] Refined persona section
- [ ] Mood board section (smartphone + watch)
- [ ] Storyboard section
- [ ] Refined experience map / user flow
- [ ] **Smartphone UI section** (separate, with Norman/Nielsen mapping per screen)
- [ ] **Smartwatch UI section** (separate, with same heuristics mapping)
- [ ] Industrial Design section (physical product)
- [ ] Reflection on changes from Assignment I (clearly marked)
- [ ] Figma prototype links (phone + watch)
- [ ] Mark every section that was added or revised from Assignment I

### 5.2 Group Report

- [ ] Full names + student IDs as signatures at the top
- [ ] List all 7 group members with student IDs
- [ ] Meeting timeline table:
  - Date | Time | Type (face-to-face / online) | Attendees | Topic discussed
- [ ] Responsibilities table at the end:
  - Member name | Department (ID / CENG) | Specific duties | Sign-off
- [ ] Confirm balanced workload between ID and CENG students — if imbalanced, note it explicitly
- [ ] Include Figma prototype link

---

## Phase 6 — Final Submission Checklist

Before you upload anything:

- [ ] PDF process report (Phases 1–5 documented)
- [ ] Smartphone demo video (MP4)
- [ ] Smartwatch demo video (MP4)
- [ ] Group report (PDF) with signatures
- [ ] Working Figma link tested in incognito browser to verify view permission
- [ ] Figma link present in BOTH the process report AND the group report
- [ ] All group members have reviewed final submissions
- [ ] File names are clear (e.g., `Group_BabyAirPurifier_ProcessReport_AssignmentII.pdf`)

---

## Suggested Work Order (Critical Path)

If you need to sequence the work in real time:

1. **Day 1–2:** Refine persona + start mood board + begin storyboard
2. **Day 3–4:** Finish mood board + storyboard + experience map
3. **Day 4–5:** Figma padding audit + Norman/Nielsen mapping + prototype interactions
4. **Day 5–6:** ID students finalize physical product visuals
5. **Day 6–7:** Record both demo videos
6. **Day 7–8:** Write the process report
7. **Day 8:** Group report + final review + submit

---

## Quick Reference — What's Missing vs. Assignment I

| Item | Status |
|------|--------|
| Persona | ✅ Have it — refine with interaction needs |
| User flow | ✅ Have it — add experience map layer |
| Smartphone UI | ✅ Have it — audit + Norman/Nielsen pass |
| Smartwatch UI | ✅ Have it — audit tap targets |
| Mood board | ❌ Missing |
| Storyboard | ❌ Missing |
| Industrial Design content | ❌ Missing in report |
| Demo videos (×2) | ❌ Missing |
| Process report (revised) | ❌ Needs update |
| Group report | ❌ Missing |
| Figma prototype links | ⚠️ Need to confirm sharing settings |
| **Expo çalışan uygulama (smartphone)** | ✅ Faz 0–5 tamamlandı — 9 ekran, 15 bileşen, navigasyon çalışıyor |

---

## Expo Uygulama İlerleme Durumu (2026-05-30)

Figma tasarımındaki 9 telefon ekranının tümü Expo/React Native ile kodlandı ve Android emülatöründe çalıştırıldı.

### Tamamlanan
- Proje kurulumu (Expo SDK 56, TypeScript)
- Design token sistemi (renkler, tipografi, spacing)
- 15 yeniden kullanılabilir bileşen
- 9 ekran (onboarding akışı + dashboard normal/alert + filtre yönetimi)
- React Navigation (Stack + Bottom Tabs + Root navigator)
- Zustand state management (onboarding + cihaz durumu)
- Alert simülasyonu (dashboard'da toggle)
- AsyncStorage ile onboarding tamamlanma flag'i

### Kalan (Faz 6–7)
- İstatistik, Uyarılar, Profil ekranları (şu an placeholder)
- Dev simülasyon butonunu `__DEV__` arkasına alma
- iOS safe area testi
- Saat (smartwatch) arayüzü ayrıca kodlanacak
