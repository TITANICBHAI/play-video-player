import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface GestureHUDProps {
  type: "brightness" | "volume" | null;
  value: number;
  visible: boolean;
}

export function GestureHUD({ type, value, visible }: GestureHUDProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible && type ? 1 : 0,
      duration: visible ? 80 : 250,
      useNativeDriver: true,
    }).start();
  }, [visible, type]);

  if (!type) return null;

  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const icon: any =
    type === "brightness"
      ? "sun"
      : value === 0
      ? "volume-x"
      : value < 0.4
      ? "volume-1"
      : "volume-2";

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      <Feather name={icon} size={22} color="#fff" />
      <View style={styles.barBg}>
        <View style={[styles.barFill, { height: `${pct}%` as any }]} />
      </View>
      <Text style={styles.label}>{pct}%</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -28,
    marginTop: -70,
    width: 56,
    height: 140,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 28,
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  barBg: {
    flex: 1,
    width: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: 4,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  label: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
});
