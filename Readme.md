# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a production-grade YouTube-inspired video player mobile app built with Expo.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── mobile/             # Expo React Native video player app
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Mobile App (`artifacts/mobile`)

A full-featured, production-grade video player inspired by YouTube's UX patterns.

### Architecture

```text
artifacts/mobile/
├── app/
│   ├── _layout.tsx           # Root layout with providers
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab layout (NativeTabs + liquid glass iOS 26 / classic fallback)
│   │   ├── index.tsx         # Home feed screen
│   │   └── library.tsx       # Watch history / library screen
│   └── player.tsx            # Full video player screen
├── components/
│   ├── Player/
│   │   ├── VideoPlayer.tsx   # Core player wrapper (expo-video)
│   │   ├── TopBar.tsx        # Back, title, share
│   │   ├── BottomControls.tsx # Play/pause, scrubber, volume, speed, fullscreen
│   │   ├── ProgressBar.tsx   # Draggable scrubber w/ buffer indicator
│   │   ├── GestureLayer.tsx  # Tap, double-tap seek zones
│   │   ├── BufferingIndicator.tsx
│   │   └── SeekIndicator.tsx # +10/-10s visual feedback
│   ├── VideoCard.tsx         # Feed and compact list card
│   └── CategoryPills.tsx     # Horizontal category filter pills
├── hooks/
│   ├── usePlayerControls.ts  # expo-video player controls hook
│   └── useAutoHide.ts        # Auto-hide controls after 3s
├── data/
│   └── videos.ts             # Sample video library
├── utils/
│   └── formatTime.ts         # Time formatting helpers
└── constants/
    └── colors.ts             # Dark theme color system
```

### Key Features

- **Video playback** via `expo-video` (SDK 54 native)
- **Local File Browser**: tap "+" in Library to pick video files via `expo-document-picker`
- **Device Video Detection**: auto-scans device media library on launch and refreshes every 30s via `expo-media-library`
- **Custom Sort System**: create named sorts with manual video selection or JS filter scripts; long-press a pill to edit/delete
- **Stats Panel**: tap the "i" info button in player to see title, duration, position, resolution, file size, speed, and more
- **Subtitle support**: load `.srt` files via CC button in player; parsed and overlaid on video
- **Background audio**: audio session configured to continue when screen locks (`expo-av`)
- **Picture-in-Picture**: enabled on Android (`supportsPictureInPicture: true` in app.json) and iOS
- **AirPlay**: AirPlay button in player TopBar (iOS)
- **Hardware decoding**: enabled by default in `expo-video`; surfaced in Settings
- **Gesture system**: tap to toggle controls, double-tap left/right to seek ±10s
- **Auto-hide controls** after 3 seconds of play
- **Auto-rotate**: fullscreen uses `ScreenOrientation.lockAsync(LANDSCAPE)` on enter and `unlockAsync()` on exit so the device can freely rotate
- **Playback speed** selector: 0.5×–2×
- **Mute/unmute** toggle
- **Skip ±10s** buttons
- **Draggable scrubber** with buffer progress visualization
- **Smooth animations** via `react-native-reanimated`
- **Haptic feedback** on seek actions
- **Watch history** persisted with `AsyncStorage`
- **Extended video metadata**: `LocalVideoItem` stores `size`, `durationSecs`, `width`, `height`, `mimeType` for sort scripts
- **Dark theme** throughout with accent red (`#FF2D55`)
- **NativeTabs** with liquid glass support (iOS 26+) with classic fallback; Android tab bar height fixed for APK builds

### Permissions

On first launch the app requests:
- **Notifications** — via `expo-notifications`
- **Media Library** — via `expo-media-library` (to read video files from device storage)

### Video Library

The `VIDEOS` array in `data/videos.ts` is currently empty (placeholder sample videos were removed in v1.4.0). Local file browsing support is planned for the next release.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config.

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client.

### `scripts` (`@workspace/scripts`)

Utility scripts package.
