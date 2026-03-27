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

export const VIDEOS: VideoItem[] = [
  {
    id: "1",
    title: "Big Buck Bunny",
    subtitle: "Blender Foundation",
    duration: "9:56",
    thumbnail: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "Animation",
    views: "142M",
    uploadedAt: "2 years ago",
  },
  {
    id: "2",
    title: "Elephant Dream",
    subtitle: "Blender Foundation",
    duration: "10:54",
    thumbnail: "https://orange.blender.org/wp-content/uploads/2006/10/01_elephant_dream_1024.jpg",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    category: "Animation",
    views: "89M",
    uploadedAt: "3 years ago",
  },
  {
    id: "3",
    title: "For Bigger Blazes",
    subtitle: "T-Mobile",
    duration: "0:15",
    thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    category: "Action",
    views: "22M",
    uploadedAt: "1 year ago",
  },
  {
    id: "4",
    title: "For Bigger Escapes",
    subtitle: "T-Mobile",
    duration: "0:15",
    thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    category: "Nature",
    views: "55M",
    uploadedAt: "8 months ago",
  },
  {
    id: "5",
    title: "For Bigger Fun",
    subtitle: "T-Mobile",
    duration: "0:30",
    thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    category: "Entertainment",
    views: "18M",
    uploadedAt: "6 months ago",
  },
  {
    id: "6",
    title: "For Bigger Joyrides",
    subtitle: "T-Mobile",
    duration: "0:15",
    thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    category: "Action",
    views: "31M",
    uploadedAt: "4 months ago",
  },
  {
    id: "7",
    title: "For Bigger Meltdowns",
    subtitle: "T-Mobile",
    duration: "0:15",
    thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    category: "Entertainment",
    views: "9M",
    uploadedAt: "3 months ago",
  },
  {
    id: "8",
    title: "Subaru Outback",
    subtitle: "Subaru",
    duration: "0:30",
    thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    category: "Auto",
    views: "4M",
    uploadedAt: "5 months ago",
  },
];

export const CATEGORIES = ["All", "Animation", "Action", "Nature", "Entertainment", "Auto"];
