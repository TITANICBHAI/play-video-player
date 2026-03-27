import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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

const { width: W } = Dimensions.get("window");
type Step = "privacy" | "tutorial";

function usePulse(minOpacity = 0.3, maxOpacity = 1, duration = 700) {
  const opacity = useRef(new Animated.Value(minOpacity)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: maxOpacity, duration, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: minOpacity, duration, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return opacity;
}

function useScalePulse(from = 1, to = 1.18, duration = 750) {
  const scale = useRef(new Animated.Value(from)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: to, duration, useNativeDriver: true }),
        Animated.timing(scale, { toValue: from, duration, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return scale;
}

function GlowRing({ size = 44, color = colors.accent }: { size?: number; color?: string }) {
  const opacity = usePulse(0, 0.7, 600);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: color,
        opacity,
      }}
    />
  );
}

function FakeVideoRow({ title, meta, icon = "film", iconColor = colors.accent }: {
  title: string; meta: string; icon?: any; iconColor?: string;
}) {
  return (
    <View style={visual.row}>
      <View style={[visual.thumb, { backgroundColor: iconColor === colors.accent ? colors.accentDim : "#1a2236" }]}>
        <Feather name={icon} size={16} color={iconColor} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={visual.rowTitle} numberOfLines={1}>{title}</Text>
        <Text style={visual.rowMeta}>{meta}</Text>
      </View>
    </View>
  );
}

function SlideAddVideo() {
  const scale = useScalePulse(1, 1.2);
  const glowOpacity = usePulse(0.2, 1, 600);
  return (
    <View style={visual.card}>
      <View style={visual.sectionHeader}>
        <Text style={visual.sectionLabel}>LOCAL FILES</Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <GlowRing size={40} />
          <Animated.View style={[visual.addCircle, { transform: [{ scale }] }]}>
            <Feather name="plus" size={18} color={colors.text} />
          </Animated.View>
          <Animated.View style={[visual.arrow, { opacity: glowOpacity }]} />
        </View>
      </View>
      <FakeVideoRow title="holiday_trip.mp4" meta="Added Mar 26" />
      <View style={visual.sep} />
      <FakeVideoRow title="concert_2024.mp4" meta="Added Mar 20" />
      <View style={visual.sep} />
      <View style={[visual.row, { opacity: 0.4 }]}>
        <View style={[visual.thumb, { backgroundColor: colors.surface, borderStyle: "dashed", borderWidth: 1, borderColor: colors.surfaceBorder }]}>
          <Feather name="plus" size={14} color={colors.textTertiary} />
        </View>
        <Text style={{ color: colors.textTertiary, fontSize: 12, fontFamily: "Inter_400Regular" }}>Tap + to add more…</Text>
      </View>
      <View style={visual.label}>
        <Feather name="arrow-up" size={12} color={colors.accent} />
        <Text style={visual.labelText}>Tap this button</Text>
      </View>
    </View>
  );
}

function SlideDeviceScan() {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const opacity = usePulse(0.4, 1, 800);
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  return (
    <View style={visual.card}>
      <View style={visual.sectionHeader}>
        <Text style={visual.sectionLabel}>DEVICE VIDEOS</Text>
        <Animated.View style={{ opacity }}>
          <Text style={{ color: colors.accent, fontSize: 11, fontFamily: "Inter_500Medium" }}>4 found</Text>
        </Animated.View>
      </View>
      <FakeVideoRow title="VID_20240312_185432.mp4" meta="3:24  ·  1920×1080" icon="video" iconColor="#5b8dee" />
      <View style={visual.sep} />
      <FakeVideoRow title="Download_Series_E01.mp4" meta="42:11  ·  1280×720" icon="video" iconColor="#5b8dee" />
      <View style={visual.sep} />
      <FakeVideoRow title="screen_recording.mp4" meta="0:58  ·  2340×1080" icon="video" iconColor="#5b8dee" />
      <View style={[visual.scanRow]}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Feather name="refresh-cw" size={12} color={colors.accent} />
        </Animated.View>
        <Text style={{ color: colors.accent, fontSize: 11, fontFamily: "Inter_400Regular", marginLeft: 6 }}>Checking for new videos…</Text>
      </View>
    </View>
  );
}

function SlideSort() {
  const scale = useScalePulse(1, 1.15);
  return (
    <View style={visual.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false} contentContainerStyle={visual.pillRow}>
        <View style={[visual.pill, visual.pillActive]}><Text style={[visual.pillText, visual.pillTextActive]}>All</Text></View>
        <View style={visual.pill}><Text style={visual.pillText}>Movies</Text></View>
        <View style={visual.pill}><Text style={visual.pillText}>HD+</Text></View>
        <Animated.View style={[visual.pillAdd, { transform: [{ scale }] }]}>
          <GlowRing size={30} />
          <Feather name="plus" size={13} color={colors.textSecondary} />
        </Animated.View>
      </ScrollView>

      <View style={visual.miniModal}>
        <Text style={visual.miniModalTitle}>New Sort</Text>
        <View style={visual.templateRow}>
          {["Long Videos", "Short Clips", "HD & Above"].map((t) => (
            <View key={t} style={visual.templateChip}>
              <Text style={visual.templateChipText}>{t}</Text>
            </View>
          ))}
        </View>
        <View style={visual.miniInput}>
          <Text style={{ color: colors.textTertiary, fontSize: 12, fontFamily: "Inter_400Regular" }}>e.g. Favorites, Work…</Text>
        </View>
      </View>
      <View style={[visual.label, { marginTop: 6 }]}>
        <Feather name="arrow-up" size={12} color={colors.accent} />
        <Text style={visual.labelText}>Long-press a pill to edit/delete</Text>
      </View>
    </View>
  );
}

function SlidePlayer() {
  const opacity = usePulse(0.5, 1, 600);
  return (
    <View style={visual.card}>
      <View style={visual.playerArea}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Animated.View style={[visual.playCircle, { opacity }]}>
            <Feather name="pause" size={22} color={colors.text} />
          </Animated.View>
        </View>
        <View style={visual.gradient} />
      </View>
      <View style={visual.controls}>
        <Text style={visual.timeText}>1:23 / 42:11</Text>
        <View style={visual.controlBtns}>
          <Feather name="volume-2" size={16} color={colors.iconDefault} />
          <Feather name="rotate-ccw" size={14} color={colors.iconDefault} />
          <Animated.View style={[visual.playBtn, { opacity }]}>
            <Feather name="pause" size={16} color={colors.text} />
          </Animated.View>
          <Feather name="rotate-cw" size={14} color={colors.iconDefault} />
          <Text style={visual.speed}>1×</Text>
          <Feather name="maximize" size={16} color={colors.iconDefault} />
        </View>
      </View>
      <View style={visual.progressBar}>
        <View style={visual.progressFill} />
        <View style={visual.progressThumb} />
      </View>
      <View style={[visual.label, { marginTop: 6 }]}>
        <Text style={visual.labelText}>Tap video to show / hide controls</Text>
      </View>
    </View>
  );
}

function SlideDoubleTap() {
  const leftOpacity = usePulse(0.2, 0.8, 700);
  const rightOpacity = usePulse(0.2, 0.8, 700);
  return (
    <View style={visual.card}>
      <View style={visual.playerArea}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Animated.View style={[visual.tapZoneLeft, { opacity: leftOpacity }]}>
            <Feather name="rewind" size={22} color={colors.accent} />
            <Text style={visual.tapLabel}>−10s</Text>
          </Animated.View>
          <Animated.View style={[visual.tapZoneRight, { opacity: rightOpacity }]}>
            <Feather name="fast-forward" size={22} color={colors.accent} />
            <Text style={visual.tapLabel}>+10s</Text>
          </Animated.View>
        </View>
      </View>
      <View style={[visual.label, { marginTop: 10 }]}>
        <Text style={visual.labelText}>Double-tap left or right side of the video</Text>
      </View>
    </View>
  );
}

function SlideFullscreen() {
  const arrowOpacity = usePulse(0.2, 1, 600);
  const scale = useScalePulse(1, 1.2);
  return (
    <View style={visual.card}>
      <View style={visual.rotateRow}>
        <View style={visual.phoneMockPortrait}>
          <Feather name="smartphone" size={36} color={colors.textTertiary} />
          <Text style={{ color: colors.textTertiary, fontSize: 9, marginTop: 2, fontFamily: "Inter_400Regular" }}>portrait</Text>
        </View>
        <Animated.View style={{ alignItems: "center", opacity: arrowOpacity }}>
          <Feather name="rotate-cw" size={28} color={colors.accent} />
          <Text style={{ color: colors.accent, fontSize: 10, fontFamily: "Inter_500Medium", marginTop: 4 }}>rotate</Text>
        </Animated.View>
        <View style={visual.phoneMockLandscape}>
          <Feather name="monitor" size={36} color={colors.textSecondary} />
          <Text style={{ color: colors.textSecondary, fontSize: 9, marginTop: 2, fontFamily: "Inter_400Regular" }}>landscape</Text>
        </View>
      </View>
      <View style={visual.controls}>
        <View style={visual.controlBtns}>
          <Feather name="volume-2" size={16} color={colors.iconDefault} />
          <Feather name="rotate-ccw" size={14} color={colors.iconDefault} />
          <View style={visual.playBtn}>
            <Feather name="play" size={16} color={colors.text} />
          </View>
          <Feather name="rotate-cw" size={14} color={colors.iconDefault} />
          <Text style={visual.speed}>1×</Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <GlowRing size={30} />
            <Animated.View style={{ transform: [{ scale }] }}>
              <Feather name="maximize" size={18} color={colors.accent} />
            </Animated.View>
          </View>
        </View>
      </View>
      <View style={[visual.label, { marginTop: 6 }]}>
        <Feather name="arrow-up" size={12} color={colors.accent} />
        <Text style={visual.labelText}>Or tap the fullscreen icon here</Text>
      </View>
    </View>
  );
}

function SlideStats() {
  const scale = useScalePulse(1, 1.22);
  const opacity = usePulse(0.3, 1, 600);
  return (
    <View style={visual.card}>
      <View style={visual.controls}>
        <Text style={visual.timeText}>0:58 / 42:11</Text>
        <View style={visual.controlBtns}>
          <Feather name="volume-2" size={16} color={colors.iconDefault} />
          <Feather name="rotate-ccw" size={14} color={colors.iconDefault} />
          <View style={visual.playBtn}>
            <Feather name="play" size={16} color={colors.text} />
          </View>
          <Feather name="rotate-cw" size={14} color={colors.iconDefault} />
          <Text style={visual.speed}>1×</Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <GlowRing size={32} />
            <Animated.View style={{ transform: [{ scale }] }}>
              <Feather name="info" size={16} color={colors.accent} />
            </Animated.View>
          </View>
          <Feather name="maximize" size={16} color={colors.iconDefault} />
        </View>
      </View>

      <Animated.View style={[visual.statsPreview, { opacity }]}>
        <View style={visual.statRow}>
          <Text style={visual.statLabel}>Duration</Text>
          <Text style={visual.statVal}>42:11</Text>
        </View>
        <View style={visual.statRow}>
          <Text style={visual.statLabel}>Resolution</Text>
          <Text style={visual.statVal}>1920 × 1080</Text>
        </View>
        <View style={visual.statRow}>
          <Text style={visual.statLabel}>File Size</Text>
          <Text style={visual.statVal}>1.2 GB</Text>
        </View>
        <View style={visual.statRow}>
          <Text style={visual.statLabel}>Speed</Text>
          <Text style={visual.statVal}>Normal (1×)</Text>
        </View>
      </Animated.View>
      <View style={[visual.label, { marginTop: 4 }]}>
        <Feather name="arrow-up" size={12} color={colors.accent} />
        <Text style={visual.labelText}>Tap ⓘ to see full video info</Text>
      </View>
    </View>
  );
}

function SlideSubtitles() {
  const opacity = usePulse(0.3, 1, 700);
  const scale = useScalePulse(1, 1.18);
  return (
    <View style={visual.card}>
      <View style={visual.controls}>
        <Text style={visual.timeText}>12:45 / 1:24:00</Text>
        <View style={visual.controlBtns}>
          <Feather name="volume-2" size={16} color={colors.iconDefault} />
          <Feather name="rotate-ccw" size={14} color={colors.iconDefault} />
          <View style={visual.playBtn}>
            <Feather name="pause" size={16} color={colors.text} />
          </View>
          <Feather name="rotate-cw" size={14} color={colors.iconDefault} />
          <Text style={visual.speed}>1×</Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <GlowRing size={30} color={colors.accent} />
            <Animated.View style={{ transform: [{ scale }] }}>
              <Feather name="message-square" size={16} color={colors.accent} />
            </Animated.View>
          </View>
          <Feather name="maximize" size={16} color={colors.iconDefault} />
        </View>
      </View>

      <Animated.View style={[visual.subtitlePreview, { opacity }]}>
        <Text style={visual.subtitleText}>
          "This is an example subtitle line."
        </Text>
      </Animated.View>

      <View style={visual.subtitleMeta}>
        <Feather name="check-circle" size={12} color="#32D74B" />
        <Text style={{ color: "#32D74B", fontSize: 11, fontFamily: "Inter_500Medium", marginLeft: 5 }}>
          my_movie.srt — saved for this video
        </Text>
      </View>

      <View style={[visual.label, { marginTop: 6 }]}>
        <Feather name="arrow-up" size={12} color={colors.accent} />
        <Text style={visual.labelText}>Tap CC to import an .srt file — saved automatically</Text>
      </View>
    </View>
  );
}

function SlidePinchZoom() {
  const scale = useScalePulse(1, 1.15, 900);
  const opacity = usePulse(0.4, 1, 700);
  return (
    <View style={visual.card}>
      <View style={visual.playerArea}>
        <Animated.View style={[
          visual.fillModeBox,
          { transform: [{ scale }] }
        ]}>
          <Feather name="film" size={32} color={colors.textTertiary} style={{ opacity: 0.5 }} />
          <Animated.View style={[visual.fillBadge, { opacity }]}>
            <Feather name="crop" size={10} color={colors.text} />
            <Text style={{ color: colors.text, fontSize: 10, fontFamily: "Inter_500Medium", marginLeft: 4 }}>
              Fill
            </Text>
          </Animated.View>
        </Animated.View>
        <View style={visual.pinchHint}>
          <Feather name="maximize-2" size={14} color={colors.textTertiary} />
          <Text style={{ color: colors.textTertiary, fontSize: 11, fontFamily: "Inter_400Regular", marginLeft: 5 }}>
            pinch out → fill
          </Text>
        </View>
        <View style={[visual.pinchHint, { marginTop: 4 }]}>
          <Feather name="minimize-2" size={14} color={colors.textTertiary} />
          <Text style={{ color: colors.textTertiary, fontSize: 11, fontFamily: "Inter_400Regular", marginLeft: 5 }}>
            pinch in → fit
          </Text>
        </View>
      </View>
      <View style={[visual.label, { marginTop: 10 }]}>
        <Text style={visual.labelText}>Pinch to zoom, or tap the crop icon in controls</Text>
      </View>
    </View>
  );
}

function SlideResume() {
  const badgeOpacity = usePulse(0.3, 1, 800);
  return (
    <View style={visual.card}>
      <View style={visual.playerArea}>
        <Animated.View style={[visual.resumeBadge, { opacity: badgeOpacity }]}>
          <Feather name="clock" size={11} color={colors.text} />
          <Text style={visual.resumeText}>Resuming…</Text>
        </Animated.View>
      </View>
      <View style={visual.progressBar}>
        <View style={[visual.progressFill, { width: "38%" }]} />
        <View style={[visual.progressThumb, { left: "38%" }]} />
      </View>
      <View style={visual.historyRows}>
        <FakeVideoRow title="concert_2024.mp4" meta="38% watched  ·  Resume" />
        <View style={visual.sep} />
        <FakeVideoRow title="holiday_trip.mp4" meta="Finished" />
      </View>
      <View style={[visual.label, { marginTop: 4 }]}>
        <Text style={visual.labelText}>Position is saved every 5 seconds automatically</Text>
      </View>
    </View>
  );
}

interface TutorialSlide {
  title: string;
  description: string;
  visual: React.ReactNode;
}

const SLIDES: TutorialSlide[] = [
  {
    title: "Add Any Video",
    description: "Tap + on the Home or Library screen to browse and open any video file from your device. It plays instantly.",
    visual: <SlideAddVideo />,
  },
  {
    title: "Device Videos Auto-Detected",
    description: "Play automatically finds all videos on your device. New downloads appear without needing to add them manually.",
    visual: <SlideDeviceScan />,
  },
  {
    title: "Smart Sorting",
    description: "Tap the + pill to create a custom sort. Pick videos by hand, or tap a template to auto-filter by duration, quality, or size.",
    visual: <SlideSort />,
  },
  {
    title: "Tap to Control",
    description: "Tap anywhere on the video to show or hide the player controls. They auto-hide after 3 seconds of playback.",
    visual: <SlidePlayer />,
  },
  {
    title: "Double-Tap to Seek",
    description: "Double-tap the left half of the video to rewind 10 seconds, or the right half to skip forward 10 seconds.",
    visual: <SlideDoubleTap />,
  },
  {
    title: "Fullscreen & Rotate",
    description: "Rotate your device to go fullscreen automatically, or tap the fullscreen icon in the player controls.",
    visual: <SlideFullscreen />,
  },
  {
    title: "Video Stats",
    description: "Tap the ⓘ info button in the player to see title, duration, resolution, file size, playback speed, and more.",
    visual: <SlideStats />,
  },
  {
    title: "Subtitles — Saved for Each Video",
    description: "Tap the CC button (always visible in the player controls) to import an .srt subtitle file. It is saved and reloads automatically every time you open that video. Tap CC again to switch or remove it. Clear all saved subtitles from Settings.",
    visual: <SlideSubtitles />,
  },
  {
    title: "Pinch to Zoom",
    description: "Pinch out on the video to fill the screen and remove black bars. Pinch back in to return to the original fit. You can also tap the crop icon in the player controls to toggle fill mode.",
    visual: <SlidePinchZoom />,
  },
  {
    title: "Resume Where You Left Off",
    description: "Your playback position is saved automatically every 5 seconds. Come back to any video and it continues from where you stopped.",
    visual: <SlideResume />,
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
            By tapping Accept, you agree to our privacy policy. All data stays on your device.
          </Text>
        </View>
      </View>
    );
  }

  const current = SLIDES[slide];

  return (
    <View style={[styles.container, { paddingTop: webTop }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width: W }]}>
            <View style={styles.visualContainer}>
              {s.visual}
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.slideTitle}>{s.title}</Text>
              <Text style={styles.slideDesc}>{s.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.tutorialFooter, { paddingBottom: webBottom + 16 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setSlide(i);
                scrollRef.current?.scrollTo({ x: W * i, animated: true });
              }}
            >
              <View style={[styles.dot, i === slide && styles.dotActive]} />
            </TouchableOpacity>
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

const visual = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: "hidden",
    padding: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  sectionLabel: {
    color: colors.textTertiary,
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  addCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    marginTop: 4,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.accent,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 10,
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.accentDim,
    justifyContent: "center",
    alignItems: "center",
  },
  rowTitle: {
    color: colors.text,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  rowMeta: {
    color: colors.textTertiary,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  sep: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginLeft: 60,
    marginRight: 14,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255,45,85,0.08)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,45,85,0.15)",
  },
  labelText: {
    color: colors.accent,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  scanRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  pillRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    alignItems: "center",
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  pillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  pillTextActive: {
    color: colors.text,
  },
  pillAdd: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  miniModal: {
    margin: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 8,
  },
  miniModalTitle: {
    color: colors.text,
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  templateRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  templateChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  templateChipText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  miniInput: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  playerArea: {
    height: 80,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#111",
    gap: 6,
  },
  timeText: {
    color: colors.text,
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    minWidth: 60,
  },
  controlBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  speed: {
    color: colors.iconDefault,
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.surfaceBorder,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 2,
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "25%",
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  progressThumb: {
    position: "absolute",
    left: "25%",
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.text,
    marginLeft: -5,
  },
  tapZoneLeft: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,45,85,0.15)",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  tapZoneRight: {
    flex: 1,
    backgroundColor: "rgba(255,45,85,0.15)",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  tapLabel: {
    color: colors.accent,
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  rotateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: "#000",
  },
  phoneMockPortrait: {
    alignItems: "center",
    gap: 2,
  },
  phoneMockLandscape: {
    alignItems: "center",
    gap: 2,
  },
  statsPreview: {
    marginHorizontal: 12,
    marginTop: 6,
    backgroundColor: colors.surface,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  statLabel: {
    color: colors.textTertiary,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  statVal: {
    color: colors.text,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  resumeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  resumeText: {
    color: colors.text,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  historyRows: {
    flex: 1,
    paddingTop: 4,
  },
  subtitlePreview: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
  },
  subtitleText: {
    color: colors.text,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  subtitleMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 6,
  },
  fillModeBox: {
    width: 100,
    height: 60,
    backgroundColor: "#111",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: "hidden",
    position: "relative",
  },
  fillBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pinchHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  slide: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 16,
  },
  visualContainer: {
    flex: 1,
    minHeight: 240,
    maxHeight: 320,
  },
  textBlock: {
    gap: 8,
    paddingBottom: 8,
  },
  slideTitle: {
    color: colors.text,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  slideDesc: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 21,
  },
  tutorialFooter: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.surfaceBorder,
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 18,
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
