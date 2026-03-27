import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
import { addLocalVideo } from "@/utils/localVideos";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const filtered = VIDEOS.filter((v) => {
    const matchCat =
      selectedCategory === "All" || v.category === selectedCategory;
    const matchSearch =
      searchQuery === "" ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

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
            <Text style={styles.logo}>PLAY</Text>
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

        {filtered.length === 0 && (
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

  const webBottom = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VideoCard video={item} onPress={handleVideoPress} layout="feed" />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          paddingBottom: insets.bottom + webBottom + 80,
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
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
  logo: {
    color: colors.accent,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
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
});
