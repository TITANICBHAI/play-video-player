import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import colors from "@/constants/colors";

interface CategoryPillsProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isActive = cat === selected;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            style={[styles.pill, isActive && styles.pillActive]}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.pillText, isActive && styles.pillTextActive]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  pillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  pillTextActive: {
    color: colors.background,
    fontFamily: "Inter_600SemiBold",
  },
});
