import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { CategoryPills } from "@/components/CategoryPills";
import { VideoCard } from "@/components/VideoCard";
import { CATEGORIES, VideoItem, VIDEOS } from "@/data/videos";
import { LocalVideoItem, addLocalVideo, getLocalVideos } from "@/utils/localVideos";
import { addRecentId } from "@/utils/storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const THUMB_HEIGHT = SCREEN_WIDTH * (9 / 16);

function LocalFeedCard({
  video,
  onPress,
}: {
  video: LocalVideoItem;
  onPress: () => void;
}) {
  const durationStr =
    video.durationSecs && video.durationSecs > 0
      ? `${Math.floor(video.durationSecs / 60)}:${String(
          Math.floor(video.durationSecs % 60)
        ).padStart(2, "0")}`
      : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={styles.localCard}>
      <View style={styles.localThumb}>
        <Feather name="film" size={44} color={colors.accent} style={{ opacity: 0.35 }} />
        {durationStr && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{durationStr}</Text>
          </View>
        )}
        <View style={styles.localPlayOverlay}>
          <View style={styles.localPlayCircle}>
            <Feather name="play" size={24} color={colors.text} />
          </View>
        </View>
      </View>
      <View style={styles.localInfo}>
        <View style={styles.localAvatar}>
          <Feather name="file" size={15} color={colors.accent} />
        </View>
        <View style={styles.localMeta}>
          <Text style={styles.localTitle} numberOfLines={2}>
            {video.title}
          </Text>
          <View style={styles.localMetaRow}>
            <Text style={styles.localMetaText}>Local File</Text>
            {video.width && video.height ? (
              <>
                <Text style={styles.metaDot}> · </Text>
                <Text style={styles.localMetaText}>
                  {video.width}×{video.height}
                </Text>
              </>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="more-vertical" size={18} color={colors.iconDim} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function DeviceFeedCard({
  asset,
  onPress,
}: {
  asset: MediaLibrary.Asset;
  onPress: () => void;
}) {
  const durationStr =
    asset.duration > 0
      ? `${Math.floor(asset.duration / 60)}:${String(
          Math.floor(asset.duration % 60)
        ).padStart(2, "0")}`
      : null;
  const displayName = asset.filename.replace(/\.[^.]+$/, "");

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={styles.localCard}>
      <View style={[styles.localThumb, { backgroundColor: "#0e1a2e" }]}>
        <Feather name="video" size={44} color="#5b8dee" style={{ opacity: 0.35 }} />
        {durationStr && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{durationStr}</Text>
          </View>
        )}
        <View style={styles.localPlayOverlay}>
          <View style={styles.localPlayCircle}>
            <Feather name="play" size={24} color={colors.text} />
          </View>
        </View>
      </View>
      <View style={styles.localInfo}>
        <View style={[styles.localAvatar, { backgroundColor: "#1a2a44" }]}>
          <Feather name="smartphone" size={15} color="#5b8dee" />
        </View>
        <View style={styles.localMeta}>
          <Text style={styles.localTitle} numberOfLines={2}>
            {displayName}
          </Text>
          <View style={styles.localMetaRow}>
            <Text style={styles.localMetaText}>Device Video</Text>
            {asset.width && asset.height ? (
              <>
                <Text style={styles.metaDot}> · </Text>
                <Text style={styles.localMetaText}>
                  {asset.width}×{asset.height}
                </Text>
              </>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="more-vertical" size={18} color={colors.iconDim} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

type FeedItem =
  | { type: "video"; data: VideoItem }
  | { type: "local"; data: LocalVideoItem }
  | { type: "device"; data: MediaLibrary.Asset };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [localVideos, setLocalVideos] = useState<LocalVideoItem[]>([]);
  const [deviceAssets, setDeviceAssets] = useState<MediaLibrary.Asset[]>([]);

  const yBounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(yBounce, {
          toValue: -7,
          duration: 380,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(yBounce, {
          toValue: 0,
          duration: 380,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.delay(1400),
      ])
    ).start();
  }, []);

  const loadDeviceVideos = useCallback(async () => {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      let granted = status === "granted";
      if (!granted) {
        const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
        granted = newStatus === "granted";
      }
      if (!granted) return;
      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.video,
        first: 300,
        sortBy: [MediaLibrary.SortBy.creationTime],
      });
      setDeviceAssets(assets);
    } catch {
      /* permission denied or unavailable */
    }
  }, []);

  useEffect(() => {
    loadDeviceVideos();
  }, [loadDeviceVideos]);

  useFocusEffect(
    useCallback(() => {
      getLocalVideos().then(setLocalVideos);
    }, [])
  );

  const filteredVIDEOS = VIDEOS.filter((v) => {
    const matchCat =
      selectedCategory === "All" || v.category === selectedCategory;
    const matchSearch =
      searchQuery === "" ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredLocals =
    selectedCategory === "All"
      ? localVideos.filter(
          (v) =>
            searchQuery === "" ||
            v.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  // Exclude device assets already saved as local files (matched by URI)
  const localUris = new Set(localVideos.map((v) => v.uri));
  const filteredDevice =
    selectedCategory === "All"
      ? deviceAssets.filter(
          (a) =>
            !localUris.has(a.uri) &&
            (searchQuery === "" ||
              a.filename.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : [];

  const feedItems: FeedItem[] = [
    ...filteredVIDEOS.map((v) => ({ type: "video" as const, data: v })),
    ...filteredLocals.map((v) => ({ type: "local" as const, data: v })),
    ...filteredDevice.map((a) => ({ type: "device" as const, data: a })),
  ];

  const webTop = Platform.OS === "web" ? 67 : 0;
  const headerTop = Platform.OS === "web" ? webTop : insets.top;

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
        const cleanName = asset.name?.replace(/\.[^.]+$/, "") ?? "Video";
        const item = await addLocalVideo({
          uri: asset.uri,
          title: cleanName,
          addedAt: Date.now(),
          size: asset.size ?? undefined,
          mimeType: asset.mimeType ?? undefined,
        });
        // Don't update state here — useFocusEffect reloads the list when
        // we return from the player, preventing duplicates on Android.
        router.push({ pathname: "/player", params: { id: item.id } });
      }
    } catch {
    } finally {
      setIsAdding(false);
    }
  };

  function renderHeader() {
    return (
      <>
        <View style={[styles.header, { paddingTop: headerTop + 10 }]}>
          <View style={styles.headerRow}>
            <View style={styles.logoRow}>
              <Text style={styles.logo}>PLA</Text>
              <Animated.Text
                style={[styles.logo, { transform: [{ translateY: yBounce }] }]}
              >
                Y
              </Animated.Text>
            </View>
            <TouchableOpacity
              style={[styles.addBtn, isAdding && styles.addBtnDisabled]}
              onPress={handlePickFile}
              disabled={isAdding}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather
                name={isAdding ? "loader" : "plus"}
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.searchBar,
              isSearchFocused && styles.searchBarFocused,
            ]}
          >
            <Feather name="search" size={18} color={colors.iconDim} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search videos..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x" size={16} color={colors.iconDim} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <CategoryPills
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {feedItems.length === 0 && (
          <View style={styles.empty}>
            <TouchableOpacity
              style={styles.emptyPickBtn}
              onPress={handlePickFile}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={28} color={colors.accent} />
            </TouchableOpacity>
            <Text style={styles.emptyText}>No videos yet</Text>
            <Text style={styles.emptySubtext}>
              Tap + to browse and play any video file from your device.
            </Text>
          </View>
        )}
      </>
    );
  }

  const handleVideoPress = (video: VideoItem) => {
    router.push({ pathname: "/player", params: { id: video.id } });
  };

  const handleLocalPress = async (video: LocalVideoItem) => {
    await addRecentId(video.id);
    router.push({ pathname: "/player", params: { id: video.id } });
  };

  const handleDevicePress = async (asset: MediaLibrary.Asset) => {
    const videoId = `asset_${asset.id}`;
    await addRecentId(videoId);
    router.push({
      pathname: "/player",
      params: {
        uri: encodeURIComponent(asset.uri),
        name: encodeURIComponent(asset.filename.replace(/\.[^.]+$/, "")),
      },
    });
  };

  const webBottom = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={styles.container}>
      <FlatList
        data={feedItems}
        keyExtractor={(item) =>
          item.type === "device" ? `asset_${item.data.id}` : item.data.id
        }
        renderItem={({ item }) => {
          if (item.type === "video") {
            return (
              <VideoCard
                video={item.data}
                onPress={handleVideoPress}
                layout="feed"
              />
            );
          }
          if (item.type === "device") {
            return (
              <DeviceFeedCard
                asset={item.data}
                onPress={() => handleDevicePress(item.data)}
              />
            );
          }
          return (
            <LocalFeedCard
              video={item.data}
              onPress={() => handleLocalPress(item.data)}
            />
          );
        }}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          paddingBottom: insets.bottom + webBottom + 80,
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingHorizontal: 14,
    paddingBottom: 8,
    backgroundColor: colors.background,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  logo: {
    color: colors.accent,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
    includeFontPadding: false,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  searchBarFocused: {
    borderColor: colors.accent,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
  },
  separator: {
    height: 12,
  },
  empty: {
    padding: 60,
    alignItems: "center",
    gap: 14,
  },
  emptyPickBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.accentDim,
    borderWidth: 2,
    borderColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptySubtext: {
    color: colors.textTertiary,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  // Local feed card
  localCard: {
    width: "100%",
    marginBottom: 4,
  },
  localThumb: {
    width: "100%",
    height: THUMB_HEIGHT,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  localPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  localPlayCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 3,
  },
  localInfo: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    alignItems: "flex-start",
  },
  localAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentDim,
    justifyContent: "center",
    alignItems: "center",
  },
  localMeta: {
    flex: 1,
  },
  localTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    lineHeight: 20,
    marginBottom: 4,
  },
  localMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  localMetaText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  metaDot: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  moreBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
