import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  RECENT: "recent_videos",
  POSITIONS: "video_positions",
  ONBOARDING_DONE: "onboarding_done",
  PRIVACY_ACCEPTED: "privacy_accepted",
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
  // Don't save if near start (<5s) or clear it if near end
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
