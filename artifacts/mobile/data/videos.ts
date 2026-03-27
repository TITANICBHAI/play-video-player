export interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  thumbnail: string;
  uri: string;
  category: string;
  views: string;
  uploadedAt: string;
}

export const VIDEOS: VideoItem[] = [];

export const CATEGORIES = ["All"];
