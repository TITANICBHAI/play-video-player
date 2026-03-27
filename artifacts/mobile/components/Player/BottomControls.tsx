import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import colors from "@/constants/colors";
import { formatTime } from "@/utils/formatTime";
import { ProgressBar } from "./ProgressBar";

interface BottomControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
  visible: boolean;
  bottomInset: number;
  onTogglePlay: () => void;
  onSeekStart: (t: number) => void;
  onSeekChange: (t: number) => void;
  onSeekEnd: (t: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onChangeRate: (rate: number) => void;
  onSkipForward: () => void;
  onSkipBack: () => void;
  onPipPress?: () => void;
  isPiP?: boolean;
  hasSubtitles?: boolean;
  onSubtitlePress?: () => void;
  onStatsPress?: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function BottomControls({
  currentTime,
  duration,
  isPlaying,
  isMuted,
  isFullscreen,
  playbackRate,
  visible,
  bottomInset,
  onTogglePlay,
  onSeekStart,
  onSeekChange,
  onSeekEnd,
  onToggleMute,
  onToggleFullscreen,
  onChangeRate,
  onSkipForward,
  onSkipBack,
  onPipPress,
  isPiP,
  hasSubtitles,
  onSubtitlePress,
  onStatsPress,
}: BottomControlsProps) {
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={[
        styles.container,
        { paddingBottom: bottomInset + (isFullscreen ? 12 : 16) },
      ]}
    >
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        isActive={isScrubbing}
        onSeekStart={(t) => {
          setIsScrubbing(true);
          onSeekStart(t);
        }}
        onSeekChange={onSeekChange}
        onSeekEnd={(t) => {
          setIsScrubbing(false);
          onSeekEnd(t);
        }}
      />

      <View style={styles.row}>
        <View style={styles.timeBlock}>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeSep}> / </Text>
          <Text style={styles.timeDuration}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            onPress={onToggleMute}
            style={styles.btn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name={isMuted ? "volume-x" : "volume-2"}
              size={20}
              color={colors.iconDefault}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSkipBack}
            style={styles.btn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="rotate-ccw" size={18} color={colors.iconDefault} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onTogglePlay} style={styles.playBtn}>
            <Feather
              name={isPlaying ? "pause" : "play"}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSkipForward}
            style={styles.btn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="rotate-cw" size={18} color={colors.iconDefault} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowSpeedPicker(true)}
            style={styles.speedBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.speedText}>
              {playbackRate === 1 ? "1×" : `${playbackRate}×`}
            </Text>
          </TouchableOpacity>

          {hasSubtitles && onSubtitlePress && (
            <TouchableOpacity
              onPress={onSubtitlePress}
              style={styles.btn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="message-square" size={18} color={colors.accent} />
            </TouchableOpacity>
          )}

          {onStatsPress && (
            <TouchableOpacity
              onPress={onStatsPress}
              style={styles.btn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="info" size={18} color={colors.iconDefault} />
            </TouchableOpacity>
          )}

          {onPipPress && Platform.OS !== "web" && (
            <TouchableOpacity
              onPress={onPipPress}
              style={styles.btn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name="minimize-2"
                size={18}
                color={isPiP ? colors.accent : colors.iconDefault}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onToggleFullscreen}
            style={styles.btn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name={isFullscreen ? "minimize" : "maximize"}
              size={20}
              color={colors.iconDefault}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showSpeedPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSpeedPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSpeedPicker(false)}
        >
          <View style={styles.speedMenu}>
            <Text style={styles.speedMenuTitle}>Playback Speed</Text>
            {SPEEDS.map((spd) => (
              <TouchableOpacity
                key={spd}
                style={[
                  styles.speedOption,
                  spd === playbackRate && styles.speedOptionActive,
                ]}
                onPress={() => {
                  onChangeRate(spd);
                  setShowSpeedPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.speedOptionText,
                    spd === playbackRate && styles.speedOptionTextActive,
                  ]}
                >
                  {spd === 1 ? "Normal" : `${spd}×`}
                </Text>
                {spd === playbackRate && (
                  <Feather name="check" size={16} color={colors.accent} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    color: colors.text,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  timeSep: {
    color: colors.textTertiary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  timeDuration: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  btn: {
    width: 38,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  speedBtn: {
    height: 40,
    minWidth: 36,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  speedText: {
    color: colors.iconDefault,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  speedMenu: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    width: "100%",
    gap: 4,
  },
  speedMenuTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  speedOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  speedOptionActive: {
    backgroundColor: colors.accentDim,
  },
  speedOptionText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  speedOptionTextActive: {
    color: colors.accent,
    fontFamily: "Inter_600SemiBold",
  },
});
