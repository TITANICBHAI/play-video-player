export const REPORT_DATE = "March 2026";
export const PRODUCT_NAME = "Play";
export const CATEGORY = "Mobile Video Player App";

export const EXECUTIVE_SUMMARY = {
  positioning:
    "For privacy-conscious mobile users who want a clean, distraction-free video player, Play is a native iOS/Android video app that delivers YouTube-quality UX without ads, tracking, or accounts. Unlike YouTube (which forces ads and surveillance) or VLC (which is powerful but ugly), Play combines premium gesture controls, auto-rotate, resume playback, and a beautiful dark UI — all 100% offline and private.",
  recommendations: [
    {
      title: "Lean hard into Privacy as the #1 differentiator",
      detail:
        "YouTube's 2025 ad-blocker crackdown drove 34M users to seek alternatives. Zero-tracking, zero-ads, local-only storage is a genuine unlock. Lead every touchpoint with it — App Store listing, onboarding, and Settings should all reinforce 'Your data never leaves your device.'",
    },
    {
      title: "Target the iOS power user niche Infuse ignores",
      detail:
        "Infuse costs $74.99 lifetime and focuses on Plex/NAS media management. nPlayer charges $8.99 but has a 2013 UI and no resume/rotation polish. Play can own the $0 tier with premium UX — the gap between free and paid is enormous and no one lives there.",
    },
    {
      title: "Ship local file + Downloads support to unlock offline-first use",
      detail:
        "The #1 user complaint across VLC, MX Player, and nPlayer is poor folder management and inconsistent file browsing. A clean local library with thumbnail previews would immediately differentiate Play from every free competitor and justify an App Store feature request.",
    },
  ],
};

export interface Competitor {
  name: string;
  stage: string;
  pricing: string;
  rating: string;
  installs: string;
  strength1: string;
  strength2: string;
  strength3: string;
  weakness1: string;
  weakness2: string;
  weakness3: string;
  threat: "high" | "medium" | "low";
}

export const COMPETITORS: Competitor[] = [
  {
    name: "YouTube",
    stage: "Public (Google)",
    pricing: "Free (ads) / Premium $13.99/mo",
    rating: "4.5★",
    installs: "10B+",
    strength1: "Unmatched content library (800M+ videos)",
    strength2: "Best-in-class recommendation algorithm",
    strength3: "YouTube Premium: offline + background play",
    weakness1: "Increasingly aggressive ads (up to 5 per video)",
    weakness2: "2024-25 UI redesign widely criticised as ugly & confusing",
    weakness3: "Tracks every watch, pause, and scroll across all accounts",
    threat: "high",
  },
  {
    name: "VLC",
    stage: "Non-profit (VideoLAN)",
    pricing: "Free (open source, no ads)",
    rating: "4.3★",
    installs: "6B+ (all platforms)",
    strength1: "Plays every format ever created — MKV, AVI, ISO, Blu-ray",
    strength2: "Completely free, no ads, no tracking, open source",
    strength3: "Network streaming: SMB, FTP, DLNA, HLS support",
    weakness1: "UI hasn't meaningfully updated in 10+ years — dated & cluttered",
    weakness2: "Forgets folder locations after idle periods (major complaint)",
    weakness3: "No resume playback across sessions; gesture controls are limited",
    threat: "medium",
  },
  {
    name: "MX Player",
    stage: "Acquired (Amazon, Nov 2024)",
    pricing: "Free (heavy ads) / Pro $5.99",
    rating: "4.3★",
    installs: "500M+ (Android)",
    strength1: "Multi-core hardware decoding — fastest on low-end Android",
    strength2: "Gesture-based volume/brightness controls pioneered by MX",
    strength3: "Kids Lock mode, subtitle customisation",
    weakness1: "Rebranded as 'Amazon MX Player' — now an OTT content platform",
    weakness2: "Extremely aggressive ads reported by 80%+ of 1-3★ reviews",
    weakness3: "iOS version severely limited vs Android; barely maintained",
    threat: "low",
  },
  {
    name: "Infuse",
    stage: "Private (Firecore)",
    pricing: "$0.99/mo · $9.99/yr · $74.99 lifetime",
    rating: "4.8★",
    installs: "~2M (iOS/tvOS)",
    strength1: "Best-in-class local + Plex/Jellyfin/Emby library management",
    strength2: "Premium audio: DTS-X, Dolby Atmos, TrueHD passthrough",
    strength3: "AirPlay, Chromecast, Apple Vision Pro, Apple TV support",
    weakness1: "Paywall-heavy: core features locked behind Pro subscription",
    weakness2: "Android-absent — iOS/macOS/tvOS only (major market gap)",
    weakness3: "Overkill for casual streaming-only users; complexity is a barrier",
    threat: "medium",
  },
  {
    name: "nPlayer",
    stage: "Private (Newin Inc.)",
    pricing: "Lite: Free · nPlayer: $4.99 · Plus: $8.99",
    rating: "4.6★",
    installs: "~500K (iOS)",
    strength1: "Full DTS, Dolby AC3/E-AC3 codec support on iOS",
    strength2: "Comprehensive network: NFS, WebDAV, Google Drive, Dropbox",
    strength3: "One-time purchase — no ongoing subscription required",
    weakness1: "UI frozen in 2013 aesthetic — described as 'Rubik's cube' by users",
    weakness2: "No auto-rotate linked to device orientation sensor",
    weakness3: "No resume playback; poor onboarding — manual configuration required",
    threat: "low",
  },
  {
    name: "Plex",
    stage: "Private ($240M funded)",
    pricing: "Free (ads) / Pass $4.99/mo or $119.99 lifetime",
    rating: "4.2★",
    installs: "50M+ (all platforms)",
    strength1: "Full media server ecosystem: organises your entire library",
    strength2: "Free ad-supported streaming content (news, movies, TV)",
    strength3: "Universal: iOS, Android, TV, Xbox, PlayStation, web",
    weakness1: "Requires a Plex server — too complex for casual users",
    weakness2: "Free tier has heavy ads and limited offline features",
    weakness3: "Sync and transcoding failures reported frequently in 1-2★ reviews",
    threat: "low",
  },
];

export interface FeatureRow {
  feature: string;
  weight: number;
  play: "✓" | "~" | "✗";
  youtube: "✓" | "~" | "✗";
  vlc: "✓" | "~" | "✗";
  mx: "✓" | "~" | "✗";
  infuse: "✓" | "~" | "✗";
  nplayer: "✓" | "~" | "✗";
  plex: "✓" | "~" | "✗";
}

export const FEATURES: FeatureRow[] = [
  { feature: "Zero ads", weight: 5, play: "✓", youtube: "✗", vlc: "✓", mx: "✗", infuse: "✓", nplayer: "✓", plex: "~" },
  { feature: "Zero tracking / privacy-first", weight: 5, play: "✓", youtube: "✗", vlc: "✓", mx: "✗", infuse: "✓", nplayer: "✓", plex: "✗" },
  { feature: "Free (no paywall)", weight: 4, play: "✓", youtube: "✓", vlc: "✓", mx: "✓", infuse: "✗", nplayer: "~", plex: "~" },
  { feature: "Resume playback", weight: 4, play: "✓", youtube: "✓", vlc: "✗", mx: "✓", infuse: "✓", nplayer: "✗", plex: "✓" },
  { feature: "Auto-rotate / immersive fullscreen", weight: 4, play: "✓", youtube: "✓", vlc: "~", mx: "✓", infuse: "✓", nplayer: "✗", plex: "✓" },
  { feature: "Double-tap seek gestures", weight: 4, play: "✓", youtube: "✓", vlc: "~", mx: "✓", infuse: "~", nplayer: "✓", plex: "~" },
  { feature: "Playback speed control", weight: 3, play: "✓", youtube: "✓", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Modern dark UI (post-2023)", weight: 3, play: "✓", youtube: "✓", vlc: "✗", mx: "✗", infuse: "✓", nplayer: "✗", plex: "~" },
  { feature: "Watch history / Library", weight: 3, play: "✓", youtube: "✓", vlc: "✗", mx: "~", infuse: "✓", nplayer: "~", plex: "✓" },
  { feature: "Privacy policy + onboarding", weight: 3, play: "✓", youtube: "✓", vlc: "✗", mx: "~", infuse: "✓", nplayer: "✗", plex: "✓" },
  { feature: "iOS + Android", weight: 3, play: "✓", youtube: "✓", vlc: "✓", mx: "~", infuse: "✗", nplayer: "✗", plex: "✓" },
  { feature: "Local file playback", weight: 3, play: "✗", youtube: "✗", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Network streaming (NFS/SMB)", weight: 2, play: "✗", youtube: "✗", vlc: "✓", mx: "~", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Chromecast / AirPlay", weight: 2, play: "✗", youtube: "✓", vlc: "~", mx: "~", infuse: "✓", nplayer: "~", plex: "✓" },
];

export const WHITE_SPACE = [
  {
    gap: "Free + Private + Beautiful",
    detail:
      "No competitor sits at the intersection of $0 cost, zero tracking, and a premium 2024-quality dark UI. YouTube is free but tracks everything. Infuse is beautiful but paid. VLC is free and private but visually stuck in 2012. Play owns this white space today.",
    kano: "Delighter → becoming Basic",
  },
  {
    gap: "Local file library with thumbnail browsing",
    detail:
      "VLC and MX Player's folder browsing is the #1 complaint in 1-2★ reviews ('can't remember folders', 'no thumbnails'). A polished local media browser with auto-generated thumbnails would be a category-defining feature for Play.",
    kano: "Performance feature",
  },
  {
    gap: "Zero-friction onboarding",
    detail:
      "nPlayer explicitly called out as 'too complex for normal users'. Plex requires a media server setup. Play's 5-step gesture tutorial after privacy policy acceptance is the only onboarding that teaches gestures before play — nobody else does this.",
    kano: "Delighter",
  },
  {
    gap: "Cross-platform resume (iCloud / device sync)",
    detail:
      "Resume playback exists in Play but only device-local. No free competitor offers cross-device resume without an account. Syncing resume positions via iCloud or a lightweight account-free mechanism would be a strong acquisition hook.",
    kano: "Performance → Delighter",
  },
];

export const ACTION_PLAN = [
  {
    action: "Add local file browser as v1.4 priority feature",
    rationale:
      "VLC and MX Player's #1 complaint in 1-2★ App Store reviews is folder management and missing thumbnails. This is the highest-weight unimplemented feature (weight: 3) where Play currently loses to all local-playback competitors.",
    trapQuestion:
      'Ask users: "How do you currently manage local video files on your phone?" — every answer that involves frustration is a conversion opportunity.',
  },
  {
    action: "Update App Store listing copy to lead with Privacy",
    rationale:
      "YouTube's 2025 ad-blocker enforcement and growing tracking backlash drove significant search volume for 'YouTube alternative no ads'. Play's current positioning doesn't capitalise on this. The first screenshot and first subtitle line should both mention privacy.",
    trapQuestion:
      '"Do you have a YouTube Premium subscription?" If yes: "Does it bother you that Google still knows every video you watch?" — creates doubt about the best-paid option.',
  },
  {
    action: "Ship background audio + now-playing lock screen widget",
    rationale:
      "Plex's and YouTube Premium's most-cited strength is background audio. Play currently stops on screen lock — a table-stakes feature gap that would block adoption for podcast/music-video users. This would also justify requesting audio session permissions, improving retention.",
    trapQuestion:
      '"Do you ever listen to videos while your screen is off, or switch to another app?" — any yes is a blocked use case today.',
  },
];

export const SOURCES = [
  "https://play.google.com/store/apps/details?id=org.videolan.vlc — VLC Android store listing, ratings",
  "https://www.mxplayer.in — MX Player official site (Amazon rebrand, Nov 2024)",
  "https://firecore.com/infuse — Infuse pricing and feature list (Firecore, 2025)",
  "https://store.steampowered.com — nPlayer App Store listing ($4.99 / $8.99 tiers)",
  "https://www.plex.tv/media-server-downloads/ — Plex Pass pricing page",
  "https://g2.com — Competitor review data (1-3★ complaint analysis)",
  "Market size: Global Video Player Software market, Grand View Research 2024 ($3.5B, 7.2% CAGR)",
  "YouTube Premium pricing: YouTube.com/premium (verified March 2026)",
];
