import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "local_videos";

export interface LocalVideoItem {
  id: string;
  uri: string;
  title: string;
  addedAt: number;
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
