import React, { useCallback, useRef } from "react";
import { PanResponder, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import colors from "@/constants/colors";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered?: number;
  isActive: boolean;
  onSeekStart: (time: number) => void;
  onSeekEnd: (time: number) => void;
  onSeekChange: (time: number) => void;
}

const BAR_HEIGHT_IDLE = 3;
const BAR_HEIGHT_ACTIVE = 5;
const THUMB_SIZE = 14;
const HIT_AREA = 28;

export function ProgressBar({
  currentTime,
  duration,
  buffered = 0,
  isActive,
  onSeekStart,
  onSeekEnd,
  onSeekChange,
}: ProgressBarProps) {
  const barWidthRef = useRef(0);
  const isDragging = useRef(false);
  const thumbScale = useSharedValue(0);

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const bufferedProgress = duration > 0 ? Math.min(buffered / duration, 1) : 0;

  const getTimeFromX = useCallback(
    (x: number) => {
      const ratio = Math.max(0, Math.min(x / barWidthRef.current, 1));
      return ratio * duration;
    },
    [duration]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        isDragging.current = true;
        thumbScale.value = withTiming(1, { duration: 120 });
        const time = getTimeFromX(evt.nativeEvent.locationX);
        onSeekStart(time);
      },
      onPanResponderMove: (_, gs) => {
        if (!isDragging.current) return;
        const time = getTimeFromX(gs.moveX - (gs.moveX - gs.x0 - gs.dx));
        const rawX = gs.x0 + gs.dx;
        const clamped = Math.max(0, Math.min(rawX, barWidthRef.current));
        const t = (clamped / barWidthRef.current) * duration;
        onSeekChange(t);
      },
      onPanResponderRelease: (_, gs) => {
        isDragging.current = false;
        thumbScale.value = withTiming(0, { duration: 120 });
        const rawX = gs.x0 + gs.dx;
        const clamped = Math.max(0, Math.min(rawX, barWidthRef.current));
        const t = (clamped / barWidthRef.current) * duration;
        onSeekEnd(t);
      },
      onPanResponderTerminate: (_, gs) => {
        isDragging.current = false;
        thumbScale.value = withTiming(0, { duration: 120 });
        const rawX = gs.x0 + gs.dx;
        const clamped = Math.max(0, Math.min(rawX, barWidthRef.current));
        const t = (clamped / barWidthRef.current) * duration;
        onSeekEnd(t);
      },
    })
  ).current;

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: thumbScale.value }],
    opacity: thumbScale.value,
  }));

  const barHeight = isActive ? BAR_HEIGHT_ACTIVE : BAR_HEIGHT_IDLE;

  return (
    <View
      style={[styles.hitArea, { height: HIT_AREA }]}
      {...panResponder.panHandlers}
      onLayout={(e) => {
        barWidthRef.current = e.nativeEvent.layout.width;
      }}
    >
      <View
        style={[
          styles.track,
          { height: barHeight, backgroundColor: colors.progressTrack },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${bufferedProgress * 100}%`,
              backgroundColor: colors.progressBuffer,
              height: barHeight,
            },
          ]}
        />
        <View
          style={[
            styles.fill,
            {
              width: `${progress * 100}%`,
              backgroundColor: colors.progress,
              height: barHeight,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            thumbStyle,
            {
              left: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    justifyContent: "center",
    width: "100%",
  },
  track: {
    width: "100%",
    borderRadius: 4,
    overflow: "visible",
    position: "relative",
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 4,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.scrubberThumb,
    top: -(THUMB_SIZE - BAR_HEIGHT_ACTIVE) / 2,
    marginLeft: -THUMB_SIZE / 2,
  },
});
