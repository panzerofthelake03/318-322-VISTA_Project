# VISTA — Air Purifier for Baby Rooms

Interactive UI prototypes for **VISTA**, a concept **medical-grade air purifier designed for
nurseries and baby rooms**. The system pairs a smartphone app with a companion smartwatch app
to give parents real-time air-quality insight, device control, and proactive safety features.

> **Academic project.** Built for İzmir Institute of Technology courses **ID322 & CENG318**
> (Joint Collaborative Assignment, Spring 2026), combining Industrial Design and Computer
> Engineering students. These are **UI/UX prototypes with mocked device data** — not a
> production device or backend. Full brief, persona, and information architecture:
> [`vista-app/ProjectDetails.md`](vista-app/ProjectDetails.md).

## Concept

Unlike standard purifiers, VISTA focuses on the nursery: near-silent Baby/Sleep modes, dimmed
LEDs, physical child-safety features, and a synchronized mobile + smartwatch ecosystem that
adapts to a family's health sensitivities and routines. The central persona is **Melis Erten**,
a safety-conscious mother of a 9-month-old.

Key features explored in the prototypes:

- Personalized onboarding with health "sensitivities" profiles
- QR-based device pairing
- Real-time air-quality monitoring (PM2.5, CO₂, humidity, temperature) with historical graphs
- Fan control, timers, Auto / Turbo / Baby / Sleep modes, and app-only Child Lock
- Air-quality and filter-maintenance notifications

## Apps in this repository

| Directory | Platform | Description |
|-----------|----------|-------------|
| [`vista-app/`](vista-app/) | Smartphone | First app prototype — onboarding → dashboard, device control, statistics, alerts. React Navigation + Zustand + custom theme. |
| [`vista-app2/`](vista-app2/) | Smartphone | Revised app — adds auth, internationalization (i18n), Inter typography, and SVG charts. Target screen designs in [`vista-app2/screen_design_imgs/`](vista-app2/screen_design_imgs/). |
| [`vista-smartclockapp/`](vista-smartclockapp/) | Smartwatch | Watch-face prototype with gesture navigation and a live air-quality (AQI) state simulator. |

Design sources: `saat arayüz.fig` (watch) and `telefof_arayüz.fig` (phone) Figma files.

## Tech stack

- [Expo](https://expo.dev) SDK ~56, React Native 0.85, React 19, TypeScript
- [Zustand](https://github.com/pmndrs/zustand) for state
- [React Navigation](https://reactnavigation.org) (phone apps); custom `Animated`/`PanResponder` navigation (watch app)
- AsyncStorage for local persistence; `react-native-svg`, `expo-linear-gradient`, `expo-haptics`, and others per app

## Getting started

Each app is independent. Pick one, install, and run:

```bash
cd vista-app          # or vista-app2 / vista-smartclockapp
npm install
npm start             # start the Expo dev server
```

Then open in **Expo Go** (scan the QR), or run on a target:

```bash
npm run android
npm run ios
npm run web           # where available
```

**Note:** This project uses Expo SDK 56, which is version-sensitive. Install native
dependencies with `npx expo install <package>` (rather than `npm install <package>`) so
compatible versions are chosen.

## Project status

Prototype / coursework. Interfaces and mock data are actively iterated to match the Figma
designs and assignment requirements. UI copy and code comments are primarily in Turkish.

## Team

İzmir Institute of Technology — ID322 & CENG318, Spring 2026:
Melike Şenlik, Sezin Ece Değirmenci, Ahmet Barış Özel, Ayşe Gizem Akkoç,
Samet Buldanlıoğlu, Büşra Şeyma Küyner, Enes Ergün Hoşgör.

## License

[MIT](LICENSE) © 2026 Ahmet-Barış-Özel
