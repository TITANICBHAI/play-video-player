import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import colors from "@/constants/colors";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  visible: boolean;
  topInset: number;
  onAirPlayPress?: () => void;
  onCCPress?: () => void;
  subtitlesActive?: boolean;
  hasSubtitles?: boolean;
  onSettingsPress?: () => void;
  onInfoPress?: () => void;
}

export function TopBar({ title, subtitle, onBack, visible, topInset, onAirPlayPress, onCCPress, subtitlesActive, hasSubtitles, onSettingsPress, onInfoPress }: TopBarProps) {
  if (!visible) return null;

  const handleShare = async () => {
    try {
      await Share.share({ message: title, title });
    } catch {}
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={[styles.container, { paddingTop: topInset + 12 }]}
    >
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Feather name="chevron-down" size={26} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        {onAirPlayPress && Platform.OS === "ios" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAirPlayPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="airplay" size={20} color={colors.iconDefault} />
          </TouchableOpacity>
        )}
        {Platform.OS !== "web" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="share-2" size={20} color={colors.iconDefault} />
          </TouchableOpacity>
        )}
        {onCCPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onCCPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name="message-square"
              size={20}
              color={subtitlesActive ? colors.accent : hasSubtitles ? colors.iconDefault : colors.iconDim}
            />
          </TouchableOpacity>
        )}
        {onSettingsPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onSettingsPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="settings" size={20} color={colors.iconDefault} />
          </TouchableOpacity>
        )}
        {onInfoPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onInfoPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="info" size={20} color={colors.iconDefault} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  titleBlock: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});
