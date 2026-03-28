import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { CHANGELOG } from "@/data/changelog";
import { PRIVACY_POLICY } from "@/data/privacyPolicy";
import { clearRecent, clearAllSubtitles, resetOnboarding } from "@/utils/storage";

const COMING_SOON = [
  {
    icon: "wifi",
    label: "Network Streaming",
    description: "Stream from SMB, NFS, and FTP network shares",
  },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  const webTop = Platform.OS === "web" ? 67 : insets.top;
  const webBottom = Platform.OS === "web" ? 34 : insets.bottom;

  const handleClearHistory = () => {
    Alert.alert(
      "Clear All History",
      "This will permanently delete your entire watch history and saved positions. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearRecent();
            Alert.alert("Cleared", "Your watch history has been deleted.");
          },
        },
      ]
    );
  };

  const handleClearSubtitles = () => {
    Alert.alert(
      "Clear All Saved Subtitles",
      "This will remove all saved subtitle files for every video. You can re-import them from the player at any time.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearAllSubtitles();
            Alert.alert("Cleared", "All saved subtitles have been removed.");
          },
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset Onboarding",
      "This will reset the welcome tutorial and privacy policy acceptance. The app will show the onboarding screen on next launch.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetOnboarding();
            Alert.alert("Reset", "Restart the app to see the onboarding again.");
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: webTop }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: webBottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Settings</Text>

        {/* App info */}
        <View style={styles.section}>
          <View style={styles.appCard}>
            <View style={styles.appIconWrap}>
              <Feather name="play-circle" size={28} color={colors.accent} />
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>Play</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="file-text"
            label="Privacy Policy"
            onPress={() => setShowPrivacy(true)}
          />
          <View style={styles.rowDivider} />
          <SettingsRow
            icon="list"
            label="Changelog"
            badge={CHANGELOG[0].version}
            onPress={() => setShowChangelog(true)}
          />
          <View style={styles.rowDivider} />
          <SettingsRow
            icon="book-open"
            label="Show Tutorial Again"
            onPress={() => router.push("/onboarding")}
          />
        </View>

        {/* Playback */}
        <Text style={styles.sectionLabel}>Playback</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Feather name="cpu" size={17} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Hardware Decoding</Text>
                <Text style={styles.subText}>GPU-accelerated for smooth 4K playback</Text>
              </View>
            </View>
            <View style={[styles.activeBadge]}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Feather name="headphones" size={17} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Background Audio</Text>
                <Text style={styles.subText}>Audio continues when the screen locks</Text>
              </View>
            </View>
            <View style={[styles.activeBadge]}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Feather name="minimize-2" size={17} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Picture-in-Picture</Text>
                <Text style={styles.subText}>Swipe home during playback to activate</Text>
              </View>
            </View>
            <View style={[styles.activeBadge]}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Feather name="cast" size={17} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>Chromecast</Text>
                <Text style={styles.subText}>
                  Cast to any Chromecast on the same Wi-Fi. No login required. Available in native builds.
                </Text>
              </View>
            </View>
            <View style={styles.nativeBadge}>
              <Text style={styles.nativeBadgeText}>Native</Text>
            </View>
          </View>
        </View>

        {/* Coming Soon */}
        {COMING_SOON.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Coming Soon</Text>
            <View style={[styles.section, { marginBottom: 24 }]}>
              {COMING_SOON.map((item, i) => (
                <React.Fragment key={item.label}>
                  {i > 0 && <View style={styles.rowDivider} />}
                  <View style={styles.row}>
                    <View style={styles.rowLeft}>
                      <View style={styles.rowIcon}>
                        <Feather name={item.icon as any} size={17} color={colors.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.rowLabel}>{item.label}</Text>
                        <Text style={styles.subText}>{item.description}</Text>
                      </View>
                    </View>
                    <View style={styles.plannedBadge}>
                      <Text style={styles.plannedBadgeText}>Planned</Text>
                    </View>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </>
        )}

        {/* Data */}
        <Text style={styles.sectionLabel}>Data & Privacy</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="trash-2"
            label="Clear Watch History"
            destructive
            onPress={handleClearHistory}
          />
          <View style={styles.rowDivider} />
          <SettingsRow
            icon="message-square"
            label="Clear All Saved Subtitles"
            destructive
            onPress={handleClearSubtitles}
          />
          <View style={styles.rowDivider} />
          <SettingsRow
            icon="refresh-cw"
            label="Reset Onboarding"
            destructive
            onPress={handleResetOnboarding}
          />
        </View>

        <Text style={styles.footerNote}>
          All data is stored locally on your device.{"\n"}
          Play never sends your data to any server.{"\n\n"}
          © 2026 TB Techs
        </Text>
      </ScrollView>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacy}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowPrivacy(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top || webTop }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <TouchableOpacity
              onPress={() => setShowPrivacy(false)}
              style={styles.modalClose}
            >
              <Feather name="x" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {PRIVACY_POLICY.split("\n\n").map((para, i) => {
              const isHeading = para.startsWith("**");
              return (
                <Text
                  key={i}
                  style={isHeading ? styles.privacyHeading : styles.privacyText}
                >
                  {para.replace(/\*\*/g, "")}
                </Text>
              );
            })}
          </ScrollView>
        </View>
      </Modal>

      {/* Changelog Modal */}
      <Modal
        visible={showChangelog}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowChangelog(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top || webTop }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Changelog</Text>
            <TouchableOpacity
              onPress={() => setShowChangelog(false)}
              style={styles.modalClose}
            >
              <Feather name="x" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}
            showsVerticalScrollIndicator={false}
          >
            {CHANGELOG.map((entry, i) => (
              <View key={i} style={styles.changelogEntry}>
                <View style={styles.changelogHeader}>
                  <View style={styles.changelogBadge}>
                    <Text style={styles.changelogVersion}>v{entry.version}</Text>
                  </View>
                  <Text style={styles.changelogDate}>{entry.date}</Text>
                  {i === 0 && (
                    <View style={styles.latestBadge}>
                      <Text style={styles.latestText}>Latest</Text>
                    </View>
                  )}
                </View>
                {entry.changes.map((c, j) => (
                  <View key={j} style={styles.changeRow}>
                    <Feather name="check-circle" size={14} color={colors.accent} style={styles.changeIcon} />
                    <Text style={styles.changeText}>{c}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  badge,
  destructive,
  onPress,
}: {
  icon: string;
  label: string;
  badge?: string;
  destructive?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, destructive && styles.rowIconDestructive]}>
          <Feather
            name={icon as any}
            size={17}
            color={destructive ? "#FF453A" : colors.accent}
          />
        </View>
        <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>
          {label}
        </Text>
      </View>
      <View style={styles.rowRight}>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
        <Feather name="chevron-right" size={16} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  sectionLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  section: {
    marginHorizontal: 16,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 14,
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  appCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  appIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.accentDim,
    justifyContent: "center",
    alignItems: "center",
  },
  appInfo: {
    gap: 2,
  },
  appName: {
    color: colors.text,
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  appVersion: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accentDim,
    justifyContent: "center",
    alignItems: "center",
  },
  rowIconDestructive: {
    backgroundColor: "rgba(255,69,58,0.15)",
  },
  rowLabel: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  rowLabelDestructive: {
    color: "#FF453A",
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginLeft: 60,
  },
  badge: {
    backgroundColor: colors.accentDim,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  subText: {
    color: colors.textTertiary,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
    lineHeight: 16,
    flexShrink: 1,
  },
  activeBadge: {
    backgroundColor: "rgba(50,215,75,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  activeBadgeText: {
    color: "#32D74B",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  nativeBadge: {
    backgroundColor: "rgba(90,160,255,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  nativeBadgeText: {
    color: "#5aa0ff",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  plannedBadge: {
    backgroundColor: "rgba(255,165,0,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  plannedBadgeText: {
    color: "#FFA500",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  footerNote: {
    color: colors.textTertiary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 18,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  modalClose: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    gap: 12,
  },
  privacyHeading: {
    color: colors.text,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
  },
  privacyText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
  },
  changelogEntry: {
    gap: 8,
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  changelogHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  changelogBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  changelogVersion: {
    color: colors.text,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  changelogDate: {
    color: colors.textTertiary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  latestBadge: {
    backgroundColor: colors.accentDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  latestText: {
    color: colors.accent,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  changeIcon: {
    marginTop: 1,
  },
  changeText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    flex: 1,
  },
});
