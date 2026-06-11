# Project Details

## Course Information

- **Course:** ID322 & CENG318 (MÜDEK ÖÇ6-PÇ8b) — Joint Collaborative Assignment II
- **Institution:** İzmir Institute of Technology
- **Semester:** Spring 2026
- **Assignment Date Reference:** Initial report submitted April 12, 2026

## Group Members

| Full Name | Student ID |
|-----------|------------|
| Melike Şenlik | 310303032 |
| Sezin Ece Değirmenci | 300303011 |
| Ahmet Barış Özel | 290201017 |
| Ayşe Gizem Akkoç | 300201028 |
| Samet Buldanlıoğlu | 300201085 |
| Büşra Şeyma Küyner | 310201060 |
| Enes Ergün Hoşgör | 300201053 |

Note: Group includes both Industrial Design (ID322) and Computer Engineering (CENG318) students.

## Product Concept

**Air Purifier for Baby Rooms** — a medical-grade air purification system specifically engineered for nurseries, childcare environments, and family homes. Unlike standard purifiers, it integrates physical safety features with a synchronized mobile and smartwatch ecosystem that learns and adapts to a family's specific health sensitivities and daily routines.

### Target Users

Health-conscious parents, caregivers, and tech-savvy families who require more than basic air filtration. Users are highly organized, proactive about their children's well-being, and value seamless digital control, detailed environmental analytics, and automated safety features.

### Key Functionality

- **Personalized Onboarding & Profiles** — secure authentication with "Sensitivities" input (allergies, pet dander, etc.)
- **Instant QR Pairing** — quick and secure device registration via QR code
- **Intelligent Air Quality & Analytics** — real-time monitoring with historical graphs and "Suggested Action" engine
- **Advanced Device Control** — fan level sliders, customizable timers, "Turbo Clean" function
- **Dedicated Nursery & Sleep Modes** — Baby Mode (near-silent, dimmed LEDs) and Sleep Mode
- **Proactive Maintenance Notifications** — air quality drops, filter alerts, maintenance tracking
- **Uncompromised Safety** — Child Lock toggleable exclusively via mobile app

## Persona

**Melis Erten**

- **Age:** 32
- **Location:** Istanbul (2+1 apartment)
- **Profession:** Senior PR Manager (currently on maternity leave)
- **Family:** Married, mother of 9-month-old daughter Lara
- **Character:** Professional, organized, "control freak," skeptical consumer due to PR background

### Needs & Motivations

- Protecting Lara from severe allergies (health priority)
- Floor-level sensitivity (Lara is crawling — exposed to dust/pollen on floor)
- Views air purifier as medical necessity, not luxury
- Reliable solution for safe, sterile environment

### Frustrations & Challenges

- Safety concerns (Lara putting fingers into device, tipping it over)
- Noise stress from loud appliances waking baby
- Anxiety over "invisible threats" she cannot see
- Operational anxiety as a busy mom

### Goals

- Healthy foundation for Lara's growth, minimizing harmful particle exposure
- Worry-free environment where Lara can develop motor skills (crawling) safely

## Information Architecture

The application follows a **hybrid flow**: linear onboarding sequence followed by a centralized hub-and-spoke dashboard model.

### Onboarding Flow

1. Welcome screen
2. Sign In / Register (email or Apple/Google)
3. Sensitivities QA (skippable)
4. QR Device Pairing
5. → Dashboard

### Dashboard Hub Branches Into

- **Notification Section** — air quality drops, filter maintenance alerts
- **Device Control** — fan speed, timers, Auto/Turbo/Baby modes, Child Lock
- **Statistics** — weekly/monthly graphs for PM2.5, humidity, electricity consumption, temperature
- **Settings** — profile, privacy, localization, device info

## Current Deliverables Status

### ✅ Already Completed (from Assignment I)

- Initial process report (PDF, April 12, 2026)
- Persona (Melis Erten) — needs refinement for interaction needs
- Information architecture / user flow diagram (Miro + finalized blueprint)
- Low-fidelity paper prototypes (onboarding, registration, control panel, notifications, statistics, settings)
- Initial Figma designs:
  - **Smartphone UI** (light coral/peach theme, ~9 screens)
  - **Smartwatch UI** (dark theme, ~20 screen variants including color-coded air quality states)
- Design rationale and reflection section
- Video scenario outline

### ❌ Still Needed for Assignment II

- Refined persona with explicit interaction needs
- Mood board (at least one per product)
- Storyboard (physical use and interaction dynamics)
- Refined experience map with emotional layer
- Explicit Norman & Nielsen usability heuristics mapping
- Industrial Design contribution (physical product design, materials, form)
- Padding/spacing audit on Figma frames
- Smartphone demo video with narration
- Smartwatch demo video with narration
- Updated process report (PDF) marking changes from Assignment I
- Group report with timeline, meeting log, and responsibilities table
- Working Figma prototype links included in both reports

## Design System Overview

### Smartphone

- **Theme:** Light, clean, spacious
- **Primary palette:** Coral/peach (primary actions, alerts), green (success/healthy states), mustard (warnings), black, cream neutrals
- **Layout:** Generous whitespace, clear hierarchy, thumb-zone bottom navigation

### Smartwatch

- **Theme:** Dark
- **Color-coded air quality states:** Green (good), yellow (moderate), red (poor), blue/purple (variant state)
- **Layout:** Glanceable — large numbers, minimal text, big tap targets
- **Rationale:** Dark theme supports nighttime use without disturbing baby

## Assignment II Requirements Summary

Per the assignment brief (ID322-CENG318 Collaborative Assignment II):

1. Create a more clearly defined persona
2. Create a more clearly structured experience and interaction map/flow
3. Revise detailed interface prototypes — focus on UX over feature representation; apply Norman & Nielsen usability rules to reduce user workload
4. Create working interface proposals using Figma/Canva
5. Prepare short demo video explaining UI interactions (with narrative)
6. Create process file/report transferring all processes from start to finish (indicate changed sections)
7. Create separate group report — workload, responsibilities, meeting processes, signatures
8. Share working prototype link in both reports

### Required Deliverables List

- PDF process report covering items 1–8
- Two demo videos (smartphone + smartwatch)
- Group report with member IDs, meeting timeline (face-to-face/online with dates and times), and responsibilities table

### Important Notes from Brief

- Smartphone and smartwatch UIs presented in **separate sections** of the report
- Industrial Design students must contribute physical product designs and physical interface proposals
- Workload must be balanced between ID and CENG students
- At least one mood board per product recommended
- Storyboard recommended to convey physical use and interaction dynamics
- Watch padding between visual elements and at screen edges in both UIs
