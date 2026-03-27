import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  function renderHeader() {
    return (
      <>
        <View style={[styles.header, { paddingTop: headerTop + 10 }]}>
          <View style={styles.headerRow}>
            <Text style={styles.logo}>PLAY</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn}>
                <Feather name="cast" size={22} color={colors.iconDefault} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Feather name="bell" size={22} color={colors.iconDefault} />
              </TouchableOpacity>
              <View style={styles.avatar}>
                <Feather name="user" size={18} color={colors.text} />
              </View>
            </View>
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
            <Feather name="play-circle" size={52} color={colors.textTertiary} />
            <Text style={styles.emptyText}>Your library is empty</Text>
            <Text style={styles.emptySubtext}>
              Local file browsing is coming soon.{"\n"}Stay tuned for the next update.
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
          paddingBottom: insets.bottom + webBottom + 20,
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
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
    gap: 10,
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
