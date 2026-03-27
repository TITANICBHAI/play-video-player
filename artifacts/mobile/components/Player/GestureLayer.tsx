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
  onPinchScale?: (scale: number) => void;
  children?: React.ReactNode;
}

const DOUBLE_TAP_DELAY = 280;
const SEEK_SECONDS = 10;
const PAN_VERTICAL_THRESHOLD = 18;
const PAN_HORIZONTAL_MAX = 45;
const PAN_SENSITIVITY = 240;

type TapSide = "left" | "right" | null;

function getTouchDist(touches: any[]): number {
  if (!touches || touches.length < 2) return 0;
  const dx = touches[0].pageX - touches[1].pageX;
  const dy = touches[0].pageY - touches[1].pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

export function GestureLayer({
  onTap,
  onDoubleTapLeft,
  onDoubleTapRight,
  onPanStart,
  onPanDelta,
  onPinchScale,
  children,
}: GestureLayerProps) {
  const lastTap = useRef<number>(0);
  const lastSide = useRef<TapSide>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panStartY = useRef<number>(0);
  const panStartX = useRef<number>(0);
  const isPanning = useRef<boolean>(false);
  const panSideRef = useRef<"left" | "right">("right");
  const isPinching = useRef<boolean>(false);
  const pinchStartDist = useRef<number>(0);

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
    const { touches } = evt.nativeEvent;

    // Detect pinch start (2+ fingers)
    if (touches && touches.length >= 2) {
      isPinching.current = true;
      pinchStartDist.current = getTouchDist(touches);
      // Cancel any pending tap
      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
        tapTimer.current = null;
        lastTap.current = 0;
        lastSide.current = null;
      }
      return;
    }

    isPinching.current = false;
    panStartY.current = evt.nativeEvent.pageY;
    panStartX.current = evt.nativeEvent.pageX;
    isPanning.current = false;
  }, []);

  const handleMove = useCallback(
    (evt: any) => {
      const { touches } = evt.nativeEvent;

      // Handle pinch
      if (isPinching.current) {
        if (touches && touches.length >= 2) {
          const dist = getTouchDist(touches);
          if (pinchStartDist.current > 0) {
            const scale = dist / pinchStartDist.current;
            onPinchScale?.(scale);
          }
        }
        return;
      }

      // If a second finger joins mid-gesture, start pinching
      if (touches && touches.length >= 2 && !isPinching.current) {
        isPinching.current = true;
        pinchStartDist.current = getTouchDist(touches);
        isPanning.current = false;
        return;
      }

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
    [onPanStart, onPanDelta, onPinchScale]
  );

  const handleRelease = useCallback(
    (evt: any) => {
      if (isPinching.current) {
        isPinching.current = false;
        pinchStartDist.current = 0;
        return;
      }
      if (!isPanning.current) {
        handleTap(evt.nativeEvent.locationX);
      }
      isPanning.current = false;
    },
    [handleTap]
  );

  const handleTerminate = useCallback(() => {
    isPinching.current = false;
    pinchStartDist.current = 0;
    isPanning.current = false;
  }, []);

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleGrant}
      onResponderMove={handleMove}
      onResponderRelease={handleRelease}
      onResponderTerminate={handleTerminate}
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
