export const REPORT_DATE = "March 2026";
export const PRODUCT_NAME = "Play";
export const CATEGORY = "Mobile Video Player App";

export const EXECUTIVE_SUMMARY = {
  positioning:
    "For privacy-conscious mobile users who want a clean, distraction-free video player, Play is a native iOS/Android app that delivers YouTube-quality UX without ads, tracking, or accounts. Unlike YouTube (which forces surveillance and ads) or VLC (powerful but visually stuck in 2012), Play combines local file browsing, subtitle support, background audio, Picture-in-Picture, gesture controls, auto-rotate, and resume playback — all 100% private, zero-tracking, and free.",
  recommendations: [
    {
      title: "Lead every touchpoint with Privacy — it's now the only free, private, AND beautiful player",
      detail:
        "YouTube's 2025 ad-blocker crackdown drove 34M users to seek alternatives. MX Player was acquired by Amazon and became a surveillance platform. VLC is private but ugly. Play is the only app in the $0 tier that is simultaneously ad-free, tracking-free, and post-2023 in design. App Store listing, screenshots, and onboarding should all lead with 'Your data never leaves your device.'",
    },
    {
      title: "Ship network streaming (SMB/NFS) to close the last major gap vs VLC and nPlayer",
      detail:
        "Play now has local file browsing, subtitles, PiP, background audio, and AirPlay — matching or exceeding most paid competitors. The only remaining table-stakes gap is NAS/SMB/NFS network streaming. VLC users cite NAS integration as the #1 reason they stay despite preferring Play's UI. This one feature unlocks the power-user segment.",
    },
    {
      title: "Target the nPlayer and VLC upgrade path with App Store search ads",
      detail:
        "nPlayer ($8.99, 2013 UI, no auto-rotate, no resume) and VLC (no resume, cluttered UI) together represent ~7M iOS installs. Users searching 'VLC alternative' or 'local video player iPhone' are high-intent upgraders. Play should capture them at the search layer — currently the only free app in that search with a modern UI.",
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
    weakness3: "No Picture-in-Picture; subtitle gesture controls are limited and non-intuitive",
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
    weakness3: "Overkill complexity for users who just want to play a file without setting up a media server",
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
  { feature: "Zero ads", weight: 5, play: "✓", youtube: "✗", vlc: "✓", mx: "✗", infuse: "✓", nplayer: "✓", plex: "~" },
  { feature: "Zero tracking / privacy-first", weight: 5, play: "✓", youtube: "✗", vlc: "✓", mx: "✗", infuse: "✓", nplayer: "✓", plex: "✗" },
  { feature: "Free (no paywall)", weight: 4, play: "✓", youtube: "✓", vlc: "✓", mx: "✓", infuse: "✗", nplayer: "~", plex: "~" },
  { feature: "Resume playback", weight: 4, play: "✓", youtube: "✓", vlc: "✗", mx: "✓", infuse: "✓", nplayer: "✗", plex: "✓" },
  { feature: "Auto-rotate / immersive fullscreen", weight: 4, play: "✓", youtube: "✓", vlc: "~", mx: "✓", infuse: "✓", nplayer: "✗", plex: "✓" },
  { feature: "Double-tap seek gestures", weight: 4, play: "✓", youtube: "✓", vlc: "~", mx: "✓", infuse: "~", nplayer: "✓", plex: "~" },
  { feature: "Local file playback", weight: 4, play: "✓", youtube: "✗", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Subtitle support (.srt)", weight: 4, play: "✓", youtube: "~", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Background audio", weight: 4, play: "✓", youtube: "~", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Picture-in-Picture", weight: 3, play: "✓", youtube: "~", vlc: "✗", mx: "✓", infuse: "✓", nplayer: "✓", plex: "~" },
  { feature: "AirPlay (iOS)", weight: 3, play: "✓", youtube: "✓", vlc: "~", mx: "~", infuse: "✓", nplayer: "~", plex: "✓" },
  { feature: "Hardware / GPU decoding", weight: 3, play: "✓", youtube: "✓", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Playback speed control", weight: 3, play: "✓", youtube: "✓", vlc: "✓", mx: "✓", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Modern dark UI (post-2023)", weight: 3, play: "✓", youtube: "✓", vlc: "✗", mx: "✗", infuse: "✓", nplayer: "✗", plex: "~" },
  { feature: "Watch history / Library", weight: 3, play: "✓", youtube: "✓", vlc: "✗", mx: "~", infuse: "✓", nplayer: "~", plex: "✓" },
  { feature: "iOS + Android", weight: 3, play: "✓", youtube: "✓", vlc: "✓", mx: "~", infuse: "✗", nplayer: "✗", plex: "✓" },
  { feature: "Zero-friction onboarding", weight: 3, play: "✓", youtube: "✓", vlc: "✗", mx: "~", infuse: "~", nplayer: "✗", plex: "✗" },
  { feature: "Network streaming (NFS/SMB)", weight: 2, play: "✗", youtube: "✗", vlc: "✓", mx: "~", infuse: "✓", nplayer: "✓", plex: "✓" },
  { feature: "Chromecast", weight: 2, play: "✗", youtube: "✓", vlc: "~", mx: "~", infuse: "✓", nplayer: "~", plex: "✓" },
];

export const WHITE_SPACE = [
  {
    gap: "Free + Private + Beautiful + Full-Featured",
    detail:
      "After v1.5, Play is the only app in the market that is simultaneously $0, zero-tracking, post-2023 UI, AND has local files, subtitles, PiP, background audio, and AirPlay. YouTube is free but tracks everything. Infuse is beautiful but paywalled. VLC is free and private but visually stuck in 2012 and missing PiP. Play now owns the entire white space.",
    kano: "Delighter — rapidly becoming table stakes",
  },
  {
    gap: "Network streaming is the last uncleared gap",
    detail:
      "VLC users cite NAS/SMB as the #1 reason they stay despite preferring Play's UI. Shipping SMB/NFS would allow Play to fully replace VLC for the power-user segment — the only remaining migration blocker. nPlayer charges $8.99 for this exact feature.",
    kano: "Performance feature — worth charging for as a Pro unlock",
  },
  {
    gap: "Zero-friction onboarding vs complex competitors",
    detail:
      "nPlayer explicitly called out as 'too complex for normal users'. Plex requires a media server setup. Play's gesture tutorial after privacy policy acceptance is the only onboarding that teaches gestures before play — nobody else does this.",
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
    action: "Ship SMB/NFS network streaming to close the last major feature gap",
    rationale:
      "Play now matches or beats every competitor on local files, subtitles, PiP, background audio, and AirPlay. The only remaining table-stakes gap vs VLC and nPlayer is NAS streaming. This one feature unlocks the power-user segment (~7M VLC iOS installs) and eliminates every remaining reason not to switch.",
    trapQuestion:
      '"Do you ever play videos from a NAS, home server, or network drive on your phone?" — any yes is a captured VLC user who would switch today if Play supported SMB.',
  },
  {
    action: "Update App Store listing to lead with Privacy + feature parity",
    rationale:
      "Play's listing likely still implies 'demo player'. Screenshots should now show: local file browser, subtitle overlay, PiP badge, and the privacy policy screen. First subtitle line: 'No ads. No tracking. No account. Ever.' This directly targets YouTube Premium subscribers who are questioning whether Google's surveillance is worth $13.99/mo.",
    trapQuestion:
      '"Do you have YouTube Premium?" If yes: "Does it bother you that Google still knows every video you watch, even as a paying subscriber?" — creates doubt about the best-paid option.',
  },
  {
    action: "Add Chromecast support to match Infuse and Plex on casting",
    rationale:
      "AirPlay (iOS) is now live. Chromecast is the Android equivalent and the only casting gap. Plex lost casting in their 2025 redesign — that user frustration is a direct conversion opportunity. Play shipping Chromecast while Plex breaks it is a strong switching moment.",
    trapQuestion:
      '"Do you cast videos to your TV?" — users who say yes and use Plex are the ideal target: frustrated with Plex\'s 2025 redesign and actively looking for alternatives.',
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
