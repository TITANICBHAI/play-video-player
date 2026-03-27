import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { acceptPrivacy, markOnboardingDone } from "@/utils/storage";
import { PRIVACY_POLICY } from "@/data/privacyPolicy";

const { width: W, height: H } = Dimensions.get("window");

type Step = "privacy" | "tutorial";

interface TutorialSlide {
  icon: string;
  iconLib: "feather";
  title: string;
  description: string;
}

const SLIDES: TutorialSlide[] = [
  {
    icon: "play-circle",
    iconLib: "feather",
    title: "Tap to Play",
    description:
      "Tap anywhere on the video to show or hide the player controls. Controls auto-hide after 3 seconds.",
  },
  {
    icon: "fast-forward",
    iconLib: "feather",
    title: "Double-Tap to Seek",
    description:
      "Double-tap the left side to rewind 10 seconds. Double-tap the right to skip forward 10 seconds.",
  },
  {
    icon: "maximize",
    iconLib: "feather",
    title: "Rotate for Fullscreen",
    description:
      "Rotate your device to go fullscreen automatically, or tap the fullscreen button. The app will follow your device orientation.",
  },
  {
    icon: "clock",
    iconLib: "feather",
    title: "Resume Where You Left Off",
    description:
      "Play stops at any time? Come back later — the app remembers exactly where you paused each video.",
  },
  {
    icon: "bookmark",
    iconLib: "feather",
    title: "Your Library",
    description:
      "Every video you watch is saved to your Library. Swipe left on any item to delete it from your history.",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>("privacy");
  const [slide, setSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const webTop = Platform.OS === "web" ? 67 : insets.top;
  const webBottom = Platform.OS === "web" ? 34 : insets.bottom;

  const handleAcceptPrivacy = async () => {
    await acceptPrivacy();
    setStep("tutorial");
  };

  const handleNext = () => {
    if (slide < SLIDES.length - 1) {
      const next = slide + 1;
      setSlide(next);
      scrollRef.current?.scrollTo({ x: W * next, animated: true });
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await markOnboardingDone();
    router.replace("/");
  };

  if (step === "privacy") {
    return (
      <View style={[styles.container, { paddingTop: webTop }]}>
        <View style={styles.privacyHeader}>
          <View style={styles.iconCircle}>
            <Feather name="shield" size={32} color={colors.accent} />
          </View>
          <Text style={styles.privacyTitle}>Privacy Policy</Text>
          <Text style={styles.privacySubtitle}>
            Please read and accept our privacy policy to continue
          </Text>
        </View>

        <ScrollView
          style={styles.privacyScroll}
          contentContainerStyle={styles.privacyScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.privacyCard}>
            {PRIVACY_POLICY.split("\n\n").map((section, i) => {
              const isHeading = section.startsWith("**") && section.includes("**");
              if (isHeading) {
                const stripped = section.replace(/\*\*/g, "");
                return (
                  <Text key={i} style={styles.privacyHeading}>
                    {stripped}
                  </Text>
                );
              }
              return (
                <Text key={i} style={styles.privacyText}>
                  {section.replace(/\*\*/g, "")}
                </Text>
              );
            })}
          </View>
        </ScrollView>

        <View style={[styles.privacyFooter, { paddingBottom: webBottom + 16 }]}>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={handleAcceptPrivacy}
            activeOpacity={0.85}
          >
            <Text style={styles.acceptBtnText}>Accept & Continue</Text>
          </TouchableOpacity>
          <Text style={styles.footerNote}>
            By tapping Accept, you agree to our privacy policy. All data stays
            on your device.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: webTop }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.tutorialScroll}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width: W }]}>
            <View style={styles.slideIconWrap}>
              <Feather name={s.icon as any} size={56} color={colors.accent} />
            </View>
            <Text style={styles.slideTitle}>{s.title}</Text>
            <Text style={styles.slideDesc}>{s.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.tutorialFooter, { paddingBottom: webBottom + 16 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === slide && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.tutorialBtns}>
          {slide < SLIDES.length - 1 ? (
            <>
              <TouchableOpacity onPress={handleFinish} style={styles.skipBtn}>
                <Text style={styles.skipBtnText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>Next</Text>
                <Feather name="arrow-right" size={18} color={colors.text} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={handleFinish}
              style={[styles.nextBtn, styles.finishBtn]}
            >
              <Text style={styles.nextBtnText}>Get Started</Text>
              <Feather name="check" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Privacy
  privacyHeader: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentDim,
    justifyContent: "center",
    alignItems: "center",
  },
  privacyTitle: {
    color: colors.text,
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  privacySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  privacyScroll: {
    flex: 1,
  },
  privacyScrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  privacyCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  privacyHeading: {
    color: colors.text,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
  privacyText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  privacyFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  acceptBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  acceptBtnText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  footerNote: {
    color: colors.textTertiary,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  // Tutorial
  tutorialScroll: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 20,
  },
  slideIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accentDim,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  slideTitle: {
    color: colors.text,
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  slideDesc: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 24,
  },
  tutorialFooter: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceBorder,
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 20,
  },
  tutorialBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  skipBtnText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  finishBtn: {
    flex: 1,
    justifyContent: "center",
  },
  nextBtnText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
