export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
  type: "major" | "minor" | "patch";
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "Mar 2026",
    type: "major",
    changes: [
      "Local video playback — open any file from your device, no account or internet needed",
      "Hardware decoding for smooth 4K and 1080p playback",
      "Device video auto-scan: Play finds all videos on your device automatically",
      "Local file browser: tap + to pick any video file and play it instantly",
      "Smart Sort: create custom named filters by duration, resolution, size, or manual selection",
      "Background audio: playback continues when you lock your screen or switch apps",
      "Picture-in-Picture: video floats over other apps — swipe home or tap the PiP button",
      "Chromecast: tap Cast in the player to stream to a Chromecast on your Wi-Fi",
      "AirPlay: cast to Apple TV or AirPlay displays from iOS",
      "Subtitles: tap the CC button in the player to load an .srt file; toggle on/off anytime",
      "Playback speed from 0.5× to 2× with pitch correction — voices stay natural at any speed",
      "Swipe gestures: left side for brightness, right side for volume",
      "Double-tap to seek ±10 seconds with haptic feedback",
      "Pinch to zoom or tap the crop icon to fill the screen and remove black bars",
      "Auto-rotate: player locks to landscape in fullscreen and unlocks on exit",
      "Immersive mode: status bar and navigation bar stay hidden during playback",
      "Resume playback: your position is saved every 5 seconds and restored automatically",
      "Video Info panel: tap ℹ in the player for resolution, quality, file size, and more",
      "Player Settings sheet: tap ⚙ to access speed, zoom, mute, subtitles, Chromecast, and PiP",
      "No ads, no accounts, no tracking — 100% private and offline",
    ],
  },
];
