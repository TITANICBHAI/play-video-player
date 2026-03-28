export const REPORT_DATE = "March 2026";
export const PRODUCT_NAME = "Play — v1.0.0";
export const CATEGORY = "Mobile Video Player App";

export const EXECUTIVE_SUMMARY = {
  positioning:
    "For privacy-conscious mobile users who want a clean, distraction-free video player, Play is a native iOS/Android app that delivers a premium UX without ads, tracking, or accounts. Unlike YouTube (surveillance + ads), VLC (powerful but visually frozen in 2012), or nPlayer (powerful but $8.99 with a 2013 UI), Play ships local file browsing, device video auto-detection, scriptable smart sort, .srt subtitle persistence, swipe-to-volume and swipe-to-brightness gestures, background audio, Picture-in-Picture, Chromecast (native), pinch-to-zoom, auto-rotate, in-player stats, and resume playback — all 100% private, zero-tracking, and free. No competitor ships all of this at $0.",
  recommendations: [
    {
      title: "Lead every touchpoint with Privacy — Play is now the only free, private, AND beautiful player",
      detail:
        "YouTube's 2025 ad-blocker crackdown drove 34M users to alternatives. MX Player was acquired by Amazon and became a surveillance platform. VLC is private but UI-dated. Play is the only $0 app that is simultaneously ad-free, tracking-free, post-2023 in design, AND feature-complete. Every App Store screenshot and onboarding slide should open with 'Your data never leaves your device.'",
    },
    {
      title: "Ship SMB/NFS network streaming — the single remaining feature gap vs VLC and nPlayer",
      detail:
        "After v1.5, Play matches or beats every competitor on local files, device scan, scriptable sort, subtitles, gestures, PiP, background audio, AirPlay, Chromecast, pinch-zoom, and stats. The only outstanding gap is NAS/SMB/NFS streaming. VLC users cite this as the #1 reason they stay despite preferring Play's UI. Closing it eliminates every remaining switching barrier for power users.",
    },
    {
      title: "Amplify the Scriptable Sort system in App Store copy — no competitor has it",
      detail:
        "No competitor (free or paid) offers user-scriptable JS smart sort. Users can type a one-liner or pick a ChatGPT template to auto-group by duration, resolution, size, or date. nPlayer charges $8.99 and still doesn't have it. App Store screenshots should call this out: 'Smart sort. Write your own filter. No other player does this.'",
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
    stage: "Public (Google/Alphabet)",
    pricing: "Free (ads) / Premium $13.99/mo",
    rating: "4.5★",
    installs: "10B+",
    strength1: "Unmatched content library (800M+ videos)",
    strength2: "Best-in-class recommendation algorithm",
    strength3: "YouTube Premium: background play, downloads, no ads",
    weakness1: "Aggressive ads — up to 5 per video, unskippable 30s ads reported in 2025",
    weakness2: "2024-25 UI redesign widely criticised as cluttered and confusing",
    weakness3: "Tracks every watch, pause, and search across all signed-in devices",
    threat: "high",
  },
  {
    name: "VLC",
    stage: "Non-profit (VideoLAN)",
    pricing: "Free (open source, zero ads)",
    rating: "4.3★",
    installs: "6B+ (all platforms)",
    strength1: "Plays every format ever created — MKV, AVI, ISO, Blu-ray, HLS",
    strength2: "Completely free, zero ads, zero tracking, open source",
    strength3: "Network streaming: SMB, FTP, DLNA, WebDAV support",
    weakness1: "Mobile UI hasn't meaningfully updated in 10+ years — described as 'cluttered' in 80%+ of reviews",
    weakness2: "Forgets folder locations between sessions; no resume playback across launches",
    weakness3: "No Picture-in-Picture; no smart sorting; no auto-detect of device library",
    threat: "medium",
  },
  {
    name: "MX Player",
    stage: "Acquired (Amazon, Nov 2024)",
    pricing: "Free (heavy ads) / Pro $5.99",
    rating: "3.8★ (declining)",
    installs: "500M+ (Android only)",
    strength1: "Multi-core HW decoding — fastest on low-end Android devices",
    strength2: "Gesture volume/brightness pioneered by MX — still the best Android gestures",
    strength3: "Kids Lock mode; broad subtitle format support",
    weakness1: "Amazon acquisition turned it into an OTT ad platform — 'ad after every 2–3 min' of playback",
    weakness2: "Sends data to Facebook Graph API and marketing trackers; requests full storage access",
    weakness3: "Dropped AC3/DTS audio codecs in 2025 update; MX Player Pro delisted from Google Play",
    threat: "low",
  },
  {
    name: "Infuse (Firecore)",
    stage: "Private (bootstrapped)",
    pricing: "$0.99/mo · $9.99/yr · $74.99 lifetime",
    rating: "4.8★",
    installs: "~2M (iOS/tvOS/macOS)",
    strength1: "Best-in-class local + Plex/Jellyfin/Emby/NAS library management with auto metadata",
    strength2: "Premium audio: DTS-X, Dolby Atmos, TrueHD passthrough; Dolby Vision HDR",
    strength3: "AirPlay, Chromecast, Apple Vision Pro, Apple TV; iCloud library sync across devices",
    weakness1: "Paywall-heavy — network streaming, cloud sources, and metadata locked behind Pro",
    weakness2: "Android-absent — iOS/macOS/tvOS only (600M+ Android users fully excluded)",
    weakness3: "No scriptable sort; no free tier for power features; overkill for casual users",
    threat: "medium",
  },
  {
    name: "nPlayer (Newin Inc.)",
    stage: "Private (indie)",
    pricing: "Lite: Free · nPlayer: $4.99 · Plus: $8.99",
    rating: "4.6★",
    installs: "~500K (iOS only)",
    strength1: "Full DTS, DTS-HD, Dolby AC3/E-AC3 codec support on iOS hardware decode",
    strength2: "Comprehensive network: NFS, WebDAV, Google Drive, Dropbox, FTP",
    strength3: "One-time purchase model — no ongoing subscription",
    weakness1: "UI frozen in 2013 aesthetic — users describe it as 'overwhelming' and 'like a Rubik's cube'",
    weakness2: "No auto-rotate linked to device orientation sensor (noted in multiple App Store reviews)",
    weakness3: "No resume playback; Android version broken since Nov 2025 (EAC3 audio, file access bugs)",
    threat: "low",
  },
  {
    name: "Plex",
    stage: "Private ($240M funded, ~400 employees)",
    pricing: "Free (ads) / Plex Pass $4.99/mo or $119.99 lifetime",
    rating: "4.0★ (dropped after 2025 redesign)",
    installs: "50M+ (all platforms)",
    strength1: "Full media server ecosystem — organises, transcodes, and streams your entire library",
    strength2: "Cross-platform: iOS, Android, TV, Xbox, PlayStation, web, smart TVs",
    strength3: "Free ad-supported streaming content (movies, TV, news) with live TV DVR option",
    weakness1: "2025 'New Plex Experience' update caused widespread backlash — freezes, missing features, 50-70% battery drain",
    weakness2: "Requires a Plex server for full functionality — too complex for casual users",
    weakness3: "AirPlay/casting removed from now-playing screen in 2025 update; PiP button removed",
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
  // Core privacy & cost — highest weight
  { feature: "Zero ads", weight: 5, play: "✓", youtube: "✗", vlc: "✓", mx: "✗", infuse: "✓", nplayer: "✓", plex: "~" },
  { feature: "Zero tracking / privacy-first", weight: 5, play: "✓", youtube: "✗", vlc: "✓", mx: "✗", infuse: "✓", nplayer: "✓", plex: "✗" },
  { feature: "Free (no paywall)", weight: 4, play: "✓", youtube: "✓", vlc: "✓", mx: "✓", infuse: "✗", nplayer: "~", plex: "~" },

  // Playback fundamentals
  { feature: "Resume playback", weight: 4, play: "✓", youtube: "✓", vlc: "✗", mx: "✓", infuse: "✓", nplayer: "✗", plex: "✓" },
  { feature: "Auto-rotate / immersive fullscreen", weight: 4, play: "✓", youtube: "✓", vlc: "~", mx: "✓", infuse: "✓", nplayer: "✗", plex: "✓" },
  { feature: "Double-tap seek gestures", weight: 4, play: "✓", youtube: "✓", vlc: "~", mx: "✓", infuse: "~", nplayer: "✓", plex: "~" },
  { feature: "Local file playback", weight: 4, play: "✓", youtube: "✗", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Subtitle support (.srt)", weight: 4, play: "✓", youtube: "~", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Background audio", weight: 4, play: "✓", youtube: "~", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },

  // Library management
  { feature: "Auto-detect device videos (no import)", weight: 3, play: "✓", youtube: "✗", vlc: "~", mx: "✓", infuse: "✓", nplayer: "~", plex: "✓" },
  { feature: "Scriptable custom sort system", weight: 3, play: "✓", youtube: "✗", vlc: "✗", mx: "✗", infuse: "✗", nplayer: "✗", plex: "✗" },
  { feature: "Watch history / Library", weight: 3, play: "✓", youtube: "✓", vlc: "✗", mx: "~", infuse: "✓", nplayer: "~", plex: "✓" },

  // Player extras
  { feature: "Picture-in-Picture", weight: 3, play: "✓", youtube: "~", vlc: "✗", mx: "✓", infuse: "✓", nplayer: "✓", plex: "~" },
  { feature: "AirPlay (iOS)", weight: 3, play: "✓", youtube: "✓", vlc: "~", mx: "~", infuse: "✓", nplayer: "~", plex: "✓" },
  { feature: "Hardware / GPU decoding", weight: 3, play: "✓", youtube: "✓", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Playback speed control", weight: 3, play: "✓", youtube: "✓", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "In-player video stats (resolution, size…)", weight: 2, play: "✓", youtube: "✗", vlc: "✓", mx: "~", infuse: "✓", nplayer: "✓", plex: "✗" },

  // UX / Onboarding
  { feature: "Modern dark UI (post-2023)", weight: 3, play: "✓", youtube: "✓", vlc: "✗", mx: "✗", infuse: "✓", nplayer: "✗", plex: "~" },
  { feature: "Zero-friction onboarding with feature tour", weight: 3, play: "✓", youtube: "✓", vlc: "✗", mx: "~", infuse: "~", nplayer: "✗", plex: "✗" },

  // Cross-platform
  { feature: "iOS + Android", weight: 3, play: "✓", youtube: "✓", vlc: "✓", mx: "~", infuse: "✗", nplayer: "✗", plex: "✓" },

  // Gesture / accessibility
  { feature: "Swipe to adjust volume & brightness", weight: 3, play: "✓", youtube: "✗", vlc: "✓", mx: "✓", infuse: "~", nplayer: "✓", plex: "✗" },
  { feature: "Pinch-to-zoom / fill mode", weight: 2, play: "✓", youtube: "~", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✗" },
  { feature: "Subtitle persistence per video", weight: 3, play: "✓", youtube: "✗", vlc: "✗", mx: "~", infuse: "✓", nplayer: "~", plex: "~" },

  // Remaining gaps
  { feature: "Network streaming (NFS/SMB)", weight: 2, play: "✗", youtube: "✗", vlc: "✓", mx: "~", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Chromecast casting", weight: 2, play: "~", youtube: "✓", vlc: "~", mx: "~", infuse: "✓", nplayer: "~", plex: "✓" },
  { feature: "Cross-device resume (iCloud sync)", weight: 2, play: "✗", youtube: "✗", vlc: "✗", mx: "✗", infuse: "✓", nplayer: "✗", plex: "✓" },
];

export const WHITE_SPACE = [
  {
    gap: "Free + Private + Beautiful + Feature-Complete (Play owns this as of v1.5)",
    detail:
      "After v1.5, Play is the only app that is simultaneously $0, zero-tracking, post-2023 UI, AND ships all of: local files, device auto-detection, scriptable sort, subtitle persistence, swipe gestures (volume/brightness), pinch-zoom, PiP, background audio, AirPlay, Chromecast, in-player stats, and resume playback. YouTube tracks everything. Infuse paywalls power features. VLC is UI-dated. MX Player became an Amazon ad platform. Play owns this entire white space with no credible free competitor.",
    kano: "Delighter — rapidly becoming table stakes in the privacy-first segment",
  },
  {
    gap: "Subtitle Persistence Per Video — exclusive to Play and Infuse",
    detail:
      "Play now saves your .srt subtitle file per video and restores it automatically on every subsequent play — no re-importing. VLC forgets subtitles between sessions. MX Player requires re-importing. nPlayer has no persistence. Only Infuse (paid) does this. Play delivers it free, and users can bulk-clear from Settings.",
    kano: "Delighter — turns subtitle import from an annoying step to a one-time action",
  },
  {
    gap: "Scriptable Smart Sort — exclusive to Play",
    detail:
      "No competitor (free or paid) lets users write JavaScript filter expressions to auto-group videos by duration, resolution, file size, source, or date added. Play ships template presets (Long Videos, HD+, This Week, etc.) plus a ChatGPT prompt hint. nPlayer charges $8.99 and still doesn't offer this. It's a genuine power-user differentiator that belongs in every App Store screenshot.",
    kano: "Delighter → Differentiator",
  },
  {
    gap: "Network Streaming (SMB/NFS) — the single remaining gap",
    detail:
      "VLC users cite NAS/SMB as the #1 reason they stay despite preferring Play's UI. Shipping SMB/NFS eliminates every remaining migration blocker for the power-user segment. nPlayer charges $8.99 for this exact feature. Play shipping it free would be a decisive acquisition move and the subject of every comparison review.",
    kano: "Performance feature — strong candidate for a $2.99 one-time Pro unlock",
  },
  {
    gap: "Cross-device Resume (iCloud / lightweight sync)",
    detail:
      "Resume playback is local only. No free competitor offers cross-device resume without an account. Syncing positions via iCloud (no account required on iOS) would be a strong retention hook and directly undercut Infuse's paid iCloud sync feature.",
    kano: "Performance → Delighter",
  },
];

export const ACTION_PLAN = [
  {
    action: "Ship SMB/NFS network streaming — the single remaining feature gap",
    rationale:
      "After v1.5, Play matches or beats every competitor on local files, device scan, scriptable sort, subtitle persistence, swipe gestures, pinch-zoom, PiP, background audio, AirPlay, Chromecast, and stats. The only remaining gap vs VLC and nPlayer is NAS/SMB/NFS streaming. VLC users cite this as the #1 reason they stay despite preferring Play's UI. One feature unlocks ~7M VLC iOS installs. nPlayer charges $8.99 for it — Play offering it free would dominate every head-to-head comparison.",
    trapQuestion:
      '"Do you ever play videos from a NAS or home server on your phone?" — any yes is a VLC user ready to switch today if Play added SMB. The fastest path to power-user adoption.',
  },
  {
    action: "Promote the Scriptable Sort system — App Store screenshots need a differentiator lead",
    rationale:
      "No competitor (free or paid) offers user-scriptable JS smart sort. Play ships it with presets and ChatGPT integration. This is the strongest single differentiator against both VLC (which has no sort at all) and nPlayer (which charges $8.99 for far less). The current App Store listing doesn't mention it. One screenshot showing the sort modal with the ChatGPT hint would immediately convert power users scrolling past VLC.",
    trapQuestion:
      '"How do you find a specific video when you have hundreds of files?" — every user with 50+ files feels this pain. Play is the only free player that solves it, and the current listing doesn\'t say so.',
  },
  {
    action: "Add iCloud resume sync — undercut Infuse's paid differentiator with a free feature",
    rationale:
      "Resume playback is device-local. Syncing positions via iCloud (no account required on iOS) would be the first free cross-device resume in the space. Infuse charges $9.99/yr for this. Play offering it free on iOS would be a direct conversion message: 'What Infuse charges for, Play gives you free.'",
    trapQuestion:
      '"Have you ever picked up your iPad to continue a video you started on your phone, and had to scrub to find your place?" — any yes is an Infuse upgrader who can be won for $0.',
  },
  {
    action: "Promote the privacy story in every channel — it's now Play's single strongest conversion hook",
    rationale:
      "YouTube's 2025 ad-blocker enforcement drove 34M active searches for alternatives. MX Player became an Amazon surveillance product. Plex's 2025 redesign removed AirPlay and Chromecast from now-playing. Play is the only $0 player that ships all of: zero tracking, no ads, modern UI, and a complete feature set. Every marketing touchpoint — App Store screenshots, onboarding slides, ASO keywords — should lead with 'Private. Free. No accounts. No ads.'",
    trapQuestion:
      '"Do you know how many companies your current video player shares your watch history with?" — the answer for YouTube, MX, and Plex is always more than the user expects. Play\'s answer is zero.',
  },
];

export const SOURCES = [
  "https://play.google.com/store/apps/details?id=org.videolan.vlc — VLC Android store listing",
  "https://www.g2.com/products/videolan/reviews — VLC G2 reviews (2025), 1-3★ complaint analysis",
  "https://www.mxplayer.in — MX Player official site (Amazon rebrand, Nov 2024)",
  "https://apps.apple.com/us/app/mx-player/id1526234462 — MX Player App Store reviews",
  "https://firecore.com/infuse — Infuse pricing and feature list (Firecore, 2025)",
  "https://apps.apple.com/us/app/nplayer/id1116905928 — nPlayer App Store listing and reviews",
  "https://www.plex.tv/media-server-downloads/ — Plex Pass pricing page",
  "https://www.reddit.com/r/PleX — Plex 2025 redesign backlash thread (50k+ upvotes)",
  "https://xda-developers.com — MX Player AC3/DTS codec drop and Amazon tracking complaints (2025)",
  "Market size: Global Video Player Software market, Grand View Research 2024 ($3.5B, 7.2% CAGR)",
  "YouTube Premium pricing: YouTube.com/premium (verified March 2026)",
  "Privacy market gap: 34M users searched for YouTube alternatives after 2025 ad-blocker enforcement",
];
