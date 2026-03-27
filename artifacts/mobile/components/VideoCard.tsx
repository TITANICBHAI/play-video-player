import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "@/constants/colors";
import { VideoItem } from "@/data/videos";

interface VideoCardProps {
  video: VideoItem;
  onPress: (video: VideoItem) => void;
  layout?: "feed" | "compact";
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH;
const THUMB_HEIGHT = CARD_WIDTH * (9 / 16);

export function VideoCard({ video, onPress, layout = "feed" }: VideoCardProps) {
  if (layout === "compact") {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={() => onPress(video)}
        activeOpacity={0.85}
      >
        <View style={styles.compactThumb}>
          <Image
            source={{ uri: video.thumbnail }}
            style={styles.compactThumbImage}
            resizeMode="cover"
          />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {video.title}
          </Text>
          <Text style={styles.compactMeta}>{video.subtitle}</Text>
          <Text style={styles.compactMeta}>
            {video.views} views · {video.uploadedAt}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="more-vertical" size={18} color={colors.iconDim} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.feedContainer}
      onPress={() => onPress(video)}
      activeOpacity={0.92}
    >
      <View style={styles.thumbContainer}>
        <Image
          source={{ uri: video.thumbnail }}
          style={[styles.thumb, { height: THUMB_HEIGHT }]}
          resizeMode="cover"
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
        <View style={styles.playOverlay}>
          <Feather name="play" size={28} color="rgba(255,255,255,0.9)" />
        </View>
      </View>
      <View style={styles.feedInfo}>
        <View style={styles.channelAvatar}>
          <Text style={styles.avatarLetter}>{video.subtitle[0]}</Text>
        </View>
        <View style={styles.feedMeta}>
          <Text style={styles.feedTitle} numberOfLines={2}>
            {video.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{video.subtitle}</Text>
            <Text style={styles.metaDot}> · </Text>
            <Text style={styles.metaText}>{video.views} views</Text>
            <Text style={styles.metaDot}> · </Text>
            <Text style={styles.metaText}>{video.uploadedAt}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="more-vertical" size={18} color={colors.iconDim} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    width: "100%",
    marginBottom: 4,
  },
  thumbContainer: {
    width: "100%",
    backgroundColor: "#111",
    position: "relative",
  },
  thumb: {
    width: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
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
  feedInfo: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    alignItems: "flex-start",
  },
  channelAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  feedMeta: {
    flex: 1,
  },
  feedTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    lineHeight: 20,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  metaText: {
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
  compactContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
    alignItems: "center",
  },
  compactThumb: {
    width: 120,
    height: 68,
    borderRadius: 6,
    backgroundColor: "#111",
    overflow: "hidden",
    position: "relative",
  },
  compactThumbImage: {
    width: "100%",
    height: "100%",
  },
  compactInfo: {
    flex: 1,
    gap: 3,
  },
  compactTitle: {
    color: colors.text,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
  compactMeta: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
