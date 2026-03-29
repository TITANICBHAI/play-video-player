# Play — Video Player App

A local-first Android video player built with React Native and Expo. Dark-themed, hardware-accelerated, and fully offline.

## GitHub Repository
https://github.com/TITANICBHAI/play-video-player

## Project Structure

```
artifacts/
  mobile/              # Main app — React Native / Expo (Android)
  api-server/          # Express API server
  competitive-analysis/ # Competitive analysis report (React/Vite)
  mockup-sandbox/      # UI component preview server
  play-demo/           # App demo video
```

## App: Play (artifacts/mobile)

### Screens
- **Home** — Video feed with search, category filters, device library scan, file import
- **Library** — Local files, device videos, recently watched, custom sorts/playlists
- **Player** — Full-featured video playback with gesture controls
- **Settings** — App info, privacy policy, changelog, data management
- **Onboarding** — Interactive tutorial with privacy policy gate

### Key Features
- Hardware-accelerated decoding (GPU) via `expo-video`
- Gesture controls: brightness (left swipe), volume (right swipe), double-tap seek, pinch-to-zoom
- Playback speed 0.5×–2× with pitch correction
- External SRT subtitle import (saved per-video)
- Picture-in-Picture support
- Background audio (continues on screen lock)
- Chromecast support (native builds)
- Auto-resume from last position (saves every 5 seconds)
- Custom sort/playlist builder with optional JS filter scripts
- Local-first: all data stored on-device, nothing sent to servers

### Tech Stack
- React Native 0.81 + Expo 54
- expo-video (hardware decode)
- expo-av (background audio)
- react-native-reanimated + react-native-gesture-handler
- expo-media-library (device scan)
- expo-document-picker (file import)
- expo-navigation-bar, expo-brightness
- AsyncStorage for persistence
- react-native-google-cast (Chromecast)

## Target Platform
**Android** (primary). iOS config exists but Android is the focus.

## Build
```
pnpm install
pnpm --filter @workspace/mobile run dev
```
