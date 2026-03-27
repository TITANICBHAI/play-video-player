import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { SeekIndicator } from "./SeekIndicator";

interface GestureLayerProps {
  onTap: () => void;
  onDoubleTapLeft: () => void;
  onDoubleTapRight: () => void;
  onPanStart?: (side: "left" | "right") => void;
  onPanDelta?: (side: "left" | "right", delta: number) => void;
  children?: React.ReactNode;
}

const DOUBLE_TAP_DELAY = 280;
const SEEK_SECONDS = 10;
const PAN_VERTICAL_THRESHOLD = 18;
const PAN_HORIZONTAL_MAX = 45;
const PAN_SENSITIVITY = 240;

type TapSide = "left" | "right" | null;

export function GestureLayer({
  onTap,
  onDoubleTapLeft,
  onDoubleTapRight,
  onPanStart,
  onPanDelta,
  children,
}: GestureLayerProps) {
  const lastTap = useRef<number>(0);
  const lastSide = useRef<TapSide>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panStartY = useRef<number>(0);
  const panStartX = useRef<number>(0);
  const isPanning = useRef<boolean>(false);
  const panSideRef = useRef<"left" | "right">("right");

  const [seekLeft, setSeekLeft] = useState(false);
  const [seekRight, setSeekRight] = useState(false);

  const triggerSeekLeft = useCallback(() => {
    setSeekLeft(false);
    requestAnimationFrame(() => setSeekLeft(true));
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onDoubleTapLeft();
  }, [onDoubleTapLeft]);

  const triggerSeekRight = useCallback(() => {
    setSeekRight(false);
    requestAnimationFrame(() => setSeekRight(true));
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onDoubleTapRight();
  }, [onDoubleTapRight]);

  const handleTap = useCallback(
    (locationX: number) => {
      const now = Date.now();
      const dt = now - lastTap.current;
      const isLeft = locationX < 140;

      if (dt < DOUBLE_TAP_DELAY && lastSide.current !== null) {
        if (tapTimer.current) clearTimeout(tapTimer.current);
        tapTimer.current = null;
        if (isLeft || lastSide.current === "left") {
          triggerSeekLeft();
        } else {
          triggerSeekRight();
        }
        lastTap.current = 0;
        lastSide.current = null;
        return;
      }

      lastTap.current = now;
      lastSide.current = isLeft ? "left" : "right";

      tapTimer.current = setTimeout(() => {
        tapTimer.current = null;
        onTap();
        lastTap.current = 0;
        lastSide.current = null;
      }, DOUBLE_TAP_DELAY);
    },
    [onTap, triggerSeekLeft, triggerSeekRight]
  );

  const handleGrant = useCallback((evt: any) => {
    panStartY.current = evt.nativeEvent.pageY;
    panStartX.current = evt.nativeEvent.pageX;
    isPanning.current = false;
  }, []);

  const handleMove = useCallback(
    (evt: any) => {
      const dy = panStartY.current - evt.nativeEvent.pageY;
      const dx = Math.abs(evt.nativeEvent.pageX - panStartX.current);

      if (
        !isPanning.current &&
        Math.abs(dy) > PAN_VERTICAL_THRESHOLD &&
        dx < PAN_HORIZONTAL_MAX
      ) {
        isPanning.current = true;
        const screenW = Dimensions.get("window").width;
        panSideRef.current =
          panStartX.current < screenW / 2 ? "left" : "right";
        if (tapTimer.current) {
          clearTimeout(tapTimer.current);
          tapTimer.current = null;
          lastTap.current = 0;
          lastSide.current = null;
        }
        onPanStart?.(panSideRef.current);
      }

      if (isPanning.current) {
        const delta = dy / PAN_SENSITIVITY;
        onPanDelta?.(panSideRef.current, delta);
      }
    },
    [onPanStart, onPanDelta]
  );

  const handleRelease = useCallback(
    (evt: any) => {
      if (!isPanning.current) {
        handleTap(evt.nativeEvent.locationX);
      }
      isPanning.current = false;
    },
    [handleTap]
  );

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handleGrant}
      onResponderMove={handleMove}
      onResponderRelease={handleRelease}
    >
      {children}
      <SeekIndicator side="left" seconds={SEEK_SECONDS} visible={seekLeft} />
      <SeekIndicator side="right" seconds={SEEK_SECONDS} visible={seekRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
