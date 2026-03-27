import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SubtitleOverlayProps {
  text: string | null;
  bottomOffset?: number;
}

export function SubtitleOverlay({ text, bottomOffset = 80 }: SubtitleOverlayProps) {
  if (!text) return null;

  return (
    <View
      style={[styles.container, { bottom: bottomOffset }]}
      pointerEvents="none"
    >
      <View style={styles.pill}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
  },
  pill: {
    backgroundColor: "rgba(0,0,0,0.78)",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    maxWidth: "90%",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
});
