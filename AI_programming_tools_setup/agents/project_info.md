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