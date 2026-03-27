import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { VideoCard } from "@/components/VideoCard";
import { VideoItem, VIDEOS } from "@/data/videos";

const RECENT_KEY = "recent_videos";

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then((val) => {
      if (val) setRecentIds(JSON.parse(val));
    });
  }, []);

  const recent = recentIds
    .map((id) => VIDEOS.find((v) => v.id === id))
    .filter(Boolean) as VideoItem[];

  const webTop = Platform.OS === "web" ? 67 : 0;
  const headerTop = Platform.OS === "web" ? webTop : insets.top;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  function renderHeader() {
    return (
      <View style={[styles.header, { paddingTop: headerTop + 10 }]}>
        <Text style={styles.headerTitle}>Library</Text>
        {recent.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              AsyncStorage.removeItem(RECENT_KEY);
              setRecentIds([]);
            }}
          >
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const handlePress = async (video: VideoItem) => {
    const updated = [video.id, ...recentIds.filter((id) => id !== video.id)].slice(0, 20);
    setRecentIds(updated);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    router.push({ pathname: "/player", params: { id: video.id } });
  };

  if (recent.length === 0) {
    return (
      <View style={[styles.container]}>
        {renderHeader()}
        <View style={styles.empty}>
          <Feather name="film" size={52} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>No watch history</Text>
          <Text style={styles.emptySubtitle}>
            Videos you watch will appear here
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push("/")}
          >
            <Text style={styles.browseBtnText}>Browse Videos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VideoCard video={item} layout="compact" onPress={handlePress} />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottom + 20 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!recent.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  clearText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingBottom: 80,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  browseBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: colors.accent,
  },
  browseBtnText: {
    color: colors.text,
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
});
