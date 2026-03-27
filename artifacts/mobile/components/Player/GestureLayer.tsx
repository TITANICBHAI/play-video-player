import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SeekIndicator } from "./SeekIndicator";

interface GestureLayerProps {
  onTap: () => void;
  onDoubleTapLeft: () => void;
  onDoubleTapRight: () => void;
  children?: React.ReactNode;
}

const DOUBLE_TAP_DELAY = 280;
const SEEK_SECONDS = 10;

type TapSide = "left" | "right" | null;

export function GestureLayer({
  onTap,
  onDoubleTapLeft,
  onDoubleTapRight,
  children,
}: GestureLayerProps) {
  const lastTap = useRef<number>(0);
  const lastSide = useRef<TapSide>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handlePress = useCallback(
    (evt: { nativeEvent: { locationX: number }; currentTarget?: unknown }) => {
      const x = evt.nativeEvent.locationX;
      const now = Date.now();
      const dt = now - lastTap.current;
      const isLeft = x < 140;
      const isRight = !isLeft;

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

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handlePress}
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
