import { useLocalSearchParams, router } from "expo-router";
import React from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { VideoPlayer } from "@/components/Player/VideoPlayer";
import { VIDEOS } from "@/data/videos";
import { VideoCard } from "@/components/VideoCard";

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const video = VIDEOS.find((v) => v.id === id);
  const related = VIDEOS.filter((v) => v.id !== id).slice(0, 5);

  if (!video) {
    return (
      <View style={[styles.errorView, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Video not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <VideoPlayer
        uri={video.uri}
        title={video.title}
        subtitle={video.subtitle}
        onBack={() => router.back()}
        autoPlay
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{video.views} views</Text>
            <Text style={styles.metaDot}> · </Text>
            <Text style={styles.metaText}>{video.uploadedAt}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{video.category}</Text>
            </View>
          </View>
          <View style={styles.channelRow}>
            <View style={styles.channelAvatar}>
              <Text style={styles.avatarLetter}>{video.subtitle[0]}</Text>
            </View>
            <View>
              <Text style={styles.channelName}>{video.subtitle}</Text>
              <Text style={styles.subscriberText}>Official Channel</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Up Next</Text>
        {related.map((v) => (
          <VideoCard
            key={v.id}
            video={v}
            layout="compact"
            onPress={(video) =>
              router.replace({ pathname: "/player", params: { id: video.id } })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  videoInfo: {
    padding: 14,
    gap: 8,
  },
  videoTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  metaDot: {
    color: colors.textTertiary,
    fontSize: 13,
  },
  categoryBadge: {
    backgroundColor: colors.accentDim,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  categoryText: {
    color: colors.accent,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  channelAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  channelName: {
    color: colors.text,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  subscriberText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginHorizontal: 12,
    marginVertical: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  errorView: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
});
