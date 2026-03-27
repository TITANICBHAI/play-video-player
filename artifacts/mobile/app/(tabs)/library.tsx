import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
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
import {
  LocalVideoItem,
  addLocalVideo,
  getLocalVideos,
  removeLocalVideo,
} from "@/utils/localVideos";
import {
  addRecentId,
  clearRecent,
  getRecentIds,
  removeRecentId,
} from "@/utils/storage";

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [localVideos, setLocalVideos] = useState<LocalVideoItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getRecentIds().then(setRecentIds);
      getLocalVideos().then(setLocalVideos);
    }, [])
  );

  const recent = recentIds
    .map((id) => VIDEOS.find((v) => v.id === id))
    .filter(Boolean) as VideoItem[];

  const webTop = Platform.OS === "web" ? 67 : insets.top;
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

  const handleLocalPress = async (video: LocalVideoItem) => {
    await addRecentId(video.id);
    setRecentIds((prev) => [video.id, ...prev.filter((id) => id !== video.id)]);
    router.push({ pathname: "/player", params: { id: video.id } });
  };

  const handleLocalDelete = async (id: string) => {
    Alert.alert("Remove file", "Remove this video from your local library?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const updated = await removeLocalVideo(id);
          setLocalVideos(updated);
          const updatedRecent = await removeRecentId(id);
          setRecentIds(updatedRecent);
        },
      },
    ]);
  };

  const handlePickFile = async () => {
    setIsAdding(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const cleanName =
          asset.name?.replace(/\.[^.]+$/, "") ?? "Unknown Video";
        const item = await addLocalVideo({
          uri: asset.uri,
          title: cleanName,
          addedAt: Date.now(),
        });
        setLocalVideos((prev) => [item, ...prev]);
        router.push({ pathname: "/player", params: { id: item.id } });
      }
    } catch {
      Alert.alert("Error", "Could not open the video file.");
    } finally {
      setIsAdding(false);
    }
  };

  const headerTop = webTop;

  return (
    <View style={styles.container}>
      <FlatList
        data={localVideos}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View>
            {/* Header */}
            <View style={[styles.header, { paddingTop: headerTop + 10 }]}>
              <Text style={styles.headerTitle}>Library</Text>
            </View>

            {/* Local Files Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Local Files</Text>
              <TouchableOpacity
                style={[styles.addBtn, isAdding && styles.addBtnDisabled]}
                onPress={handlePickFile}
                disabled={isAdding}
              >
                <Feather
                  name={isAdding ? "loader" : "plus"}
                  size={16}
                  color={colors.text}
                />
                <Text style={styles.addBtnText}>
                  {isAdding ? "Opening…" : "Add Video"}
                </Text>
              </TouchableOpacity>
            </View>

            {localVideos.length === 0 && (
              <TouchableOpacity
                style={styles.emptyLocal}
                onPress={handlePickFile}
                activeOpacity={0.7}
              >
                <Feather name="folder-plus" size={36} color={colors.textTertiary} />
                <Text style={styles.emptyLocalTitle}>Add your first video</Text>
                <Text style={styles.emptyLocalSub}>
                  Tap to browse video files from your device
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <LocalVideoRow
            video={item}
            onPress={() => handleLocalPress(item)}
            onDelete={() => handleLocalDelete(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListFooterComponent={() =>
          recent.length > 0 ? (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recently Watched</Text>
                <TouchableOpacity onPress={handleClearAll}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              {recent.map((v) => (
                <SwipeableVideoCard
                  key={v.id}
                  video={v}
                  onPress={handlePress}
                  onDelete={() => handleDelete(v.id)}
                />
              ))}
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottom + 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function LocalVideoRow({
  video,
  onPress,
  onDelete,
}: {
  video: LocalVideoItem;
  onPress: () => void;
  onDelete: () => void;
}) {
  const date = new Date(video.addedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      style={styles.localRow}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.localThumb}>
        <Feather name="film" size={22} color={colors.accent} />
      </View>
      <View style={styles.localInfo}>
        <Text style={styles.localTitle} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.localMeta}>Added {date}</Text>
      </View>
      <TouchableOpacity
        style={styles.localDeleteBtn}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="trash-2" size={18} color={colors.textTertiary} />
      </TouchableOpacity>
    </TouchableOpacity>
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
        Animated.spring(translateX, {
          toValue: -DELETE_WIDTH,
          useNativeDriver: true,
        }).start();
        isOpen = true;
      } else {
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
            const x = Math.max(
              -DELETE_WIDTH * 1.2,
              Math.min(0, gs.dx + (isOpen ? -DELETE_WIDTH : 0))
            );
            translateX.setValue(x);
          }}
          onResponderRelease={(_, gs) =>
            handleSwipe(gs.dx + (isOpen ? -DELETE_WIDTH : 0))
          }
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
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  sectionTitle: {
    color: colors.textTertiary,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  clearText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  addBtnText: {
    color: colors.text,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  emptyLocal: {
    margin: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    borderStyle: "dashed",
    paddingVertical: 36,
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surfaceElevated,
  },
  emptyLocalTitle: {
    color: colors.textSecondary,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
  emptyLocalSub: {
    color: colors.textTertiary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  sep: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginLeft: 72,
    marginRight: 16,
  },
  localRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  localThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.accentDim,
    justifyContent: "center",
    alignItems: "center",
  },
  localInfo: {
    flex: 1,
    gap: 3,
  },
  localTitle: {
    color: colors.text,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    lineHeight: 20,
  },
  localMeta: {
    color: colors.textTertiary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  localDeleteBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
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
