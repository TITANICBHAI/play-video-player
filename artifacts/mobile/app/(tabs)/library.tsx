import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
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
import { addRecentId, clearRecent, getRecentIds, removeRecentId } from "@/utils/storage";

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      getRecentIds().then(setRecentIds);
    }, [])
  );

  const recent = recentIds
    .map((id) => VIDEOS.find((v) => v.id === id))
    .filter(Boolean) as VideoItem[];

  const webTop = Platform.OS === "web" ? 67 : insets.top;
  const headerTop = Platform.OS === "web" ? webTop : insets.top;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const handlePress = async (video: VideoItem) => {
    const updated = await addRecentId(video.id);
    setRecentIds(updated);
    router.push({ pathname: "/player", params: { id: video.id } });
  };

  const handleDelete = async (id: string) => {
    const updated = await removeRecentId(id);
    setRecentIds(updated);
  };

  const handleClearAll = async () => {
    await clearRecent();
    setRecentIds([]);
  };

  function renderHeader() {
    return (
      <View style={[styles.header, { paddingTop: headerTop + 10 }]}>
        <Text style={styles.headerTitle}>Library</Text>
        {recent.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (recent.length === 0) {
    return (
      <View style={styles.container}>
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
          <SwipeableVideoCard
            video={item}
            onPress={handlePress}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottom + 20 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!recent.length}
      />
    </View>
  );
}

function SwipeableVideoCard({
  video,
  onPress,
  onDelete,
}: {
  video: VideoItem;
  onPress: (v: VideoItem) => void;
  onDelete: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const DELETE_WIDTH = 80;
  let isOpen = false;

  const handleSwipe = useCallback(
    (dx: number) => {
      if (dx < -DELETE_WIDTH * 0.5) {
        // Open delete
        Animated.spring(translateX, {
          toValue: -DELETE_WIDTH,
          useNativeDriver: true,
        }).start();
        isOpen = true;
      } else {
        // Close
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        isOpen = false;
      }
    },
    [translateX]
  );

  return (
    <View style={styles.swipeRow}>
      {/* Delete action revealed on swipe */}
      <View style={styles.deleteAction}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={onDelete}
          activeOpacity={0.85}
        >
          <Feather name="trash-2" size={20} color="#fff" />
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[styles.swipeContent, { transform: [{ translateX }] }]}
        onStartShouldSetResponder={() => false}
      >
        <View
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={(_, gs) => Math.abs(gs.dx) > 8}
          onResponderMove={(_, gs) => {
            const x = Math.max(-DELETE_WIDTH * 1.2, Math.min(0, gs.dx + (isOpen ? -DELETE_WIDTH : 0)));
            translateX.setValue(x);
          }}
          onResponderRelease={(_, gs) => handleSwipe(gs.dx + (isOpen ? -DELETE_WIDTH : 0))}
        >
          <VideoCard video={video} layout="compact" onPress={onPress} />
        </View>
      </Animated.View>
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
  swipeRow: {
    overflow: "hidden",
    position: "relative",
  },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: "#FF453A",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  deleteBtnText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  swipeContent: {
    backgroundColor: colors.background,
  },
});
