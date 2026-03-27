import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "local_videos";
const SORTS_KEY = "custom_sorts";

export interface LocalVideoItem {
  id: string;
  uri: string;
  title: string;
  addedAt: number;
  size?: number;
  durationSecs?: number;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface CustomSort {
  id: string;
  name: string;
  videoIds: string[];
  script?: string;
}

export async function getLocalVideos(): Promise<LocalVideoItem[]> {
  try {
    const val = await AsyncStorage.getItem(KEY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export async function addLocalVideo(
  video: Omit<LocalVideoItem, "id">
): Promise<LocalVideoItem> {
  const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const item: LocalVideoItem = { id, ...video };
  const current = await getLocalVideos();
  const updated = [item, ...current];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return item;
}

export async function removeLocalVideo(id: string): Promise<LocalVideoItem[]> {
  const current = await getLocalVideos();
  const updated = current.filter((v) => v.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export async function getLocalVideo(id: string): Promise<LocalVideoItem | null> {
  const videos = await getLocalVideos();
  return videos.find((v) => v.id === id) ?? null;
}

export async function getCustomSorts(): Promise<CustomSort[]> {
  try {
    const val = await AsyncStorage.getItem(SORTS_KEY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export async function saveCustomSorts(sorts: CustomSort[]): Promise<void> {
  await AsyncStorage.setItem(SORTS_KEY, JSON.stringify(sorts));
}

export async function addCustomSort(sort: Omit<CustomSort, "id">): Promise<CustomSort> {
  const id = `sort_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const item: CustomSort = { id, ...sort };
  const current = await getCustomSorts();
  const updated = [...current, item];
  await saveCustomSorts(updated);
  return item;
}

export async function updateCustomSort(sort: CustomSort): Promise<void> {
  const current = await getCustomSorts();
  const updated = current.map((s) => (s.id === sort.id ? sort : s));
  await saveCustomSorts(updated);
}

export async function deleteCustomSort(id: string): Promise<CustomSort[]> {
  const current = await getCustomSorts();
  const updated = current.filter((s) => s.id !== id);
  await saveCustomSorts(updated);
  return updated;
}

export function applyScript(
  script: string,
  videos: Array<LocalVideoItem & { type?: string }>
): string[] {
  try {
    const fn = new Function("video", `"use strict"; return (${script})`);
    return videos
      .filter((v) => {
        try {
          return !!fn(v);
        } catch {
          return false;
        }
      })
      .map((v) => v.id);
  } catch {
    return [];
  }
}
