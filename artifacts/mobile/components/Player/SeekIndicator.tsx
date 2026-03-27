import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import colors from "@/constants/colors";

interface SeekIndicatorProps {
  side: "left" | "right";
  seconds: number;
  visible: boolean;
}

export function SeekIndicator({ side, seconds, visible }: SeekIndicatorProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 300 })
      );
      scale.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(1, { duration: 500 }),
        withTiming(0.8, { duration: 300 })
      );
    }
  }, [visible, opacity, scale]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        side === "left" ? styles.left : styles.right,
        animStyle,
        { pointerEvents: "none" },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.icons}>
          {side === "left" ? (
            <>
              <Feather name="skip-back" size={20} color={colors.text} />
            </>
          ) : (
            <>
              <Feather name="skip-forward" size={20} color={colors.text} />
            </>
          )}
        </View>
        <Text style={styles.label}>{seconds}s</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "50%",
    marginTop: -36,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  left: {
    left: 32,
  },
  right: {
    right: 32,
  },
  content: {
    alignItems: "center",
    gap: 2,
  },
  icons: {
    flexDirection: "row",
    gap: 2,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
});
