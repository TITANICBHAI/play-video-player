import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  RECENT: "recent_videos",
  POSITIONS: "video_positions",
  ONBOARDING_DONE: "onboarding_done",
  PRIVACY_ACCEPTED: "privacy_accepted",
  SUBTITLES: "video_subtitles",
} as const;

// ── Recent history ──────────────────────────────────────────────────────────

export async function getRecentIds(): Promise<string[]> {
  const val = await AsyncStorage.getItem(KEYS.RECENT);
  return val ? JSON.parse(val) : [];
}

export async function addRecentId(id: string): Promise<string[]> {
  const current = await getRecentIds();
  const updated = [id, ...current.filter((x) => x !== id)].slice(0, 30);
  await AsyncStorage.setItem(KEYS.RECENT, JSON.stringify(updated));
  return updated;
}

export async function removeRecentId(id: string): Promise<string[]> {
  const current = await getRecentIds();
  const updated = current.filter((x) => x !== id);
  await AsyncStorage.setItem(KEYS.RECENT, JSON.stringify(updated));
  return updated;
}

export async function clearRecent(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.RECENT);
}

// ── Playback positions ──────────────────────────────────────────────────────

export async function getPosition(videoId: string): Promise<number> {
  const val = await AsyncStorage.getItem(KEYS.POSITIONS);
  const map: Record<string, number> = val ? JSON.parse(val) : {};
  return map[videoId] ?? 0;
}

export async function savePosition(videoId: string, seconds: number): Promise<void> {
  const val = await AsyncStorage.getItem(KEYS.POSITIONS);
  const map: Record<string, number> = val ? JSON.parse(val) : {};
  if (seconds < 5) {
    delete map[videoId];
  } else {
    map[videoId] = seconds;
  }
  await AsyncStorage.setItem(KEYS.POSITIONS, JSON.stringify(map));
}

export async function clearPosition(videoId: string): Promise<void> {
  const val = await AsyncStorage.getItem(KEYS.POSITIONS);
  const map: Record<string, number> = val ? JSON.parse(val) : {};
  delete map[videoId];
  await AsyncStorage.setItem(KEYS.POSITIONS, JSON.stringify(map));
}

// ── Onboarding / Privacy ────────────────────────────────────────────────────

export async function isOnboardingDone(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
  return val === "true";
}

export async function markOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, "true");
}

export async function isPrivacyAccepted(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.PRIVACY_ACCEPTED);
  return val === "true";
}

export async function acceptPrivacy(): Promise<void> {
  await AsyncStorage.setItem(KEYS.PRIVACY_ACCEPTED, "true");
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.ONBOARDING_DONE, KEYS.PRIVACY_ACCEPTED]);
}

// ── Subtitle persistence ────────────────────────────────────────────────────

interface SavedSubtitle {
  uri: string;
  filename: string;
  content: string;
}

export async function getSavedSubtitle(videoId: string): Promise<SavedSubtitle | null> {
  try {
    const val = await AsyncStorage.getItem(KEYS.SUBTITLES);
    const map: Record<string, SavedSubtitle> = val ? JSON.parse(val) : {};
    return map[videoId] ?? null;
  } catch {
    return null;
  }
}

export async function saveSubtitle(
  videoId: string,
  uri: string,
  filename: string,
  content: string
): Promise<void> {
  try {
    const val = await AsyncStorage.getItem(KEYS.SUBTITLES);
    const map: Record<string, SavedSubtitle> = val ? JSON.parse(val) : {};
    map[videoId] = { uri, filename, content };
    await AsyncStorage.setItem(KEYS.SUBTITLES, JSON.stringify(map));
  } catch {}
}

export async function clearSubtitle(videoId: string): Promise<void> {
  try {
    const val = await AsyncStorage.getItem(KEYS.SUBTITLES);
    const map: Record<string, SavedSubtitle> = val ? JSON.parse(val) : {};
    delete map[videoId];
    await AsyncStorage.setItem(KEYS.SUBTITLES, JSON.stringify(map));
  } catch {}
}

export async function clearAllSubtitles(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.SUBTITLES);
}
