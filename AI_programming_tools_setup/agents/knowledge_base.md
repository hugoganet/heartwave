
# Project Knowledge Base

**Last updated:** 2025-04-28

---

# ——— ProjectInfo ———

---
name: "HEARTWAVE"

created: "[2025-04-27]"

lead:    "Founder: Hugo Ganet"

version: 0.1.0

---

## Goals

- Allow users in real-world public places (bars, restaurants, events) to send a mutual "heart" without direct messaging.
- Only notify users if there is a **mutual match** (both people liked each other), avoiding unwanted attention.
- Provide a clean, fast, intuitive mobile experience optimized for casual public encounters.
- Auto-refresh user location periodically in the background to keep nearby suggestions fresh without battery draining.

## QualityAttributes

- target_p95_latency_ms: 250 (fast location update and nearby users loading)
- target_realtime_location_refresh_sec: 30
- firebase_uptime: 99.9% (using Firebase Auth + Firestore for high availability)
- UX smoothness: loading indicators, toasts for feedback, zero-blocking interactions
- Privacy-first: users stay anonymous until a mutual match occurs

## Constraints

- Must work fully on Android and iOS (via React Native Expo, no native-only features)
- Firebase must be used for authentication, real-time database, and storage
- No heavy battery-draining background services: location updates must be lightweight and manual/periodic
- Initial target audience: France, Europe (GDPR compliant by default using Firebase)
- App MVP must be lightweight (<20MB bundle size)

---

## Dependency Versions

### Node.js Version

- 20.7.0

### Python Version

- 3.11.2

### Dependencies

- **@react-navigation/native**: ^7.1.6
- **@react-navigation/native-stack**: ^7.3.10
- **expo**: ~52.0.46
- **expo-location**: ~18.0.10
- **expo-status-bar**: ~2.0.1
- **firebase**: ^11.6.1
- **react**: 18.3.1
- **react-native**: 0.76.9
- **react-native-gesture-handler**: ~2.20.2
- **react-native-reanimated**: ~3.16.1
- **react-native-safe-area-context**: 4.12.0
- **react-native-screens**: ~4.4.0
- **react-native-toast-message**: ^2.3.0

---

## Project Structure

/Users/hugoganet/Code/heartwave
├── assets
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src
│   ├── components
│   │   ├── MatchCard.tsx
│   │   └── UserCard.tsx
│   ├── firebase
│   │   └── firebaseConfig.ts
│   ├── hooks
│   │   └── useHomeLogic.ts
│   ├── navigation
│   │   └── AppNavigator.tsx
│   ├── screens
│   │   ├── HomeScreen.tsx
│   │   ├── MatchesScreen.tsx
│   │   └── WelcomeScreen.tsx
│   ├── services
│   │   ├── authService.ts
│   │   ├── firestoreService.ts
│   │   └── locationService.ts
│   ├── styles
│   │   └── homeStyles.ts
│   └── utils
│       ├── constants.ts
│       └── distance.ts
├── app.json
├── App.tsx
├── index.ts
├── package-lock.json
├── package.json
└── tsconfig.json
