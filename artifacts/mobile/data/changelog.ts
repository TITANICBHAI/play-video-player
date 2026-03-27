export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
  type: "major" | "minor" | "patch";
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.5.0",
    date: "Mar 2026",
    type: "major",
    changes: [
      "Local File Browser: pick and play any video from your device storage",
      "Subtitle support: load .srt files via the CC button in the player",
      "Background audio: playback continues when screen locks or you switch apps",
      "Picture-in-Picture: enabled for iOS 15+ and Android (swipe home to activate)",
      "AirPlay: tap the AirPlay icon in the player to cast on iOS",
      "Hardware decoding active by default for smooth 4K playback",
    ],
  },
  {
    version: "1.4.0",
    date: "Mar 2026",
    type: "major",
    changes: [
      "Media library permission request on first launch",
      "Removed placeholder sample videos — library is now empty and ready for your content",
      "Added Coming Soon roadmap in Settings showing planned features",
    ],
  },
  {
    version: "1.3.0",
    date: "Mar 2026",
    type: "major",
    changes: [
      "Auto-rotate: app now follows your device orientation",
      "Immersive mode: status & nav bar stay hidden during playback",
      "Resume playback from where you left off",
      "Privacy policy & onboarding tutorial",
      "Swipe to delete items from watch history",
      "Settings screen with changelog and privacy info",
      "Notification permission request on first launch",
    ],
  },
  {
    version: "1.2.0",
    date: "Feb 2026",
    type: "major",
    changes: [
      "Migrated video engine to expo-video for smoother playback",
      "Added double-tap gesture to seek ±10 seconds",
      "Haptic feedback on seek and fullscreen toggle",
      "Playback speed selector (0.5× – 2×)",
      "Progress bar now shows buffered content",
    ],
  },
  {
    version: "1.1.0",
    date: "Jan 2026",
    type: "minor",
    changes: [
      "Watch history persisted in Library tab",
      "Category filter pills on Home screen",
      "Search bar to filter video feed",
      "Dark theme polish and icon updates",
    ],
  },
  {
    version: "1.0.0",
    date: "Dec 2025",
    type: "major",
    changes: [
      "Initial release of the Play video player",
      "Full-featured player with play/pause, seek, mute",
      "Fullscreen support with orientation lock",
      "Native liquid glass tabs on iOS 26+",
    ],
  },
];
