import * as Brightness from "expo-brightness";
import * as Haptics from "expo-haptics";
import * as NavigationBar from "expo-navigation-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { useAutoHide } from "@/hooks/useAutoHide";
import { SubtitleCue, getCurrentSubtitle } from "@/utils/srtParser";
import { castMedia, endCastSession, isCastAvailable } from "@/utils/castService";
import { BufferingIndicator } from "./BufferingIndicator";
import { BottomControls } from "./BottomControls";
import { GestureHUD } from "./GestureHUD";
import { GestureLayer } from "./GestureLayer";
import { SubtitleOverlay } from "./SubtitleOverlay";
import { TopBar } from "./TopBar";
import { Feather } from "@expo/vector-icons";
import { formatTime } from "@/utils/formatTime";

interface VideoMeta {
  size?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  durationSecs?: number;
}

interface VideoPlayerProps {
  uri: string;
  title: string;
  subtitle?: string;
  resumeFrom?: number;
  onBack?: () => void;
  autoPlay?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  subtitleCues?: SubtitleCue[];
  onSubtitlePress?: () => void;
  videoMeta?: VideoMeta;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function getFilename(uri: string): string {
  try {
    const parts = uri.split("/");
    const name = parts[parts.length - 1];
    return decodeURIComponent(name.split("?")[0]);
  } catch {
    return uri;
  }
}

export function VideoPlayer({
  uri,
  title,
  subtitle,
  resumeFrom = 0,
  onBack,
  autoPlay = false,
  onTimeUpdate,
  subtitleCues = [],
  onSubtitlePress,
  videoMeta,
}: VideoPlayerProps) {
  const insets = useSafeAreaInsets();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenDims, setScreenDims] = useState(Dimensions.get("window"));

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(resumeFrom);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(1);
  const [currentBrightness, setCurrentBrightness] = useState(1);
  const [hudVisible, setHudVisible] = useState(false);
  const [hudType, setHudType] = useState<"brightness" | "volume">("volume");
  const [hudValue, setHudValue] = useState(0);
  const [isCasting, setIsCasting] = useState(false);
  const [isFillMode, setIsFillMode] = useState(false);

  const isSeeking = useRef(false);
  const hasResumed = useRef(false);
  const videoViewRef = useRef<VideoView>(null);
  const brightnessStart = useRef(1);
  const volumeStart = useRef(1);
  const hudTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinchBaseIsFill = useRef(false);

  const player = useVideoPlayer(uri, (p) => {
    p.timeUpdateEventInterval = 1;
    if (autoPlay) p.play();
  });

  const currentSubtitle =
    subtitleCues.length > 0 ? getCurrentSubtitle(subtitleCues, currentTime) : null;

  const contentFit: "contain" | "cover" = isFillMode ? "cover" : "contain";

  useEffect(() => {
    const playingSub = player.addListener("playingChange", (evt) => {
      setIsPlaying(evt.isPlaying);
    });
    const timeSub = player.addListener("timeUpdate", (evt) => {
      if (!isSeeking.current) {
        setCurrentTime(evt.currentTime);
        onTimeUpdate?.(evt.currentTime);
      }
    });
    const statusSub = player.addListener("statusChange", (evt) => {
      if (evt.status === "readyToPlay") {
        setDuration(player.duration);
        setIsBuffering(false);
        setHasError(false);
        setIsReady(true);
        if (!hasResumed.current && resumeFrom > 0) {
          hasResumed.current = true;
          player.currentTime = resumeFrom;
          setCurrentTime(resumeFrom);
        }
      } else if (evt.status === "loading") {
        setIsBuffering(true);
      } else if (evt.status === "error") {
        setHasError(true);
        setIsBuffering(false);
      }
    });
    const muteSub = player.addListener("mutedChange", (evt) => {
      setIsMuted(evt.muted);
    });
    const rateSub = player.addListener("playbackRateChange", (evt) => {
      setPlaybackRateState(evt.playbackRate);
    });
    return () => {
      playingSub.remove();
      timeSub.remove();
      statusSub.remove();
      muteSub.remove();
      rateSub.remove();
    };
  }, [player, resumeFrom, onTimeUpdate]);

  useEffect(() => {
    if (Platform.OS === "web") return;
    const sub = ScreenOrientation.addOrientationChangeListener((evt) => {
      const { orientation } = evt.orientationInfo;
      const isLand =
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
      setIsFullscreen(isLand);
      if (isLand) {
        setImmersive(true);
      } else {
        setImmersive(false);
      }
    });
    return () => {
      ScreenOrientation.removeOrientationChangeListener(sub);
    };
  }, []);

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setScreenDims(window);
    });
    return () => sub.remove();
  }, []);

  const setImmersive = useCallback(async (on: boolean) => {
    if (Platform.OS === "android") {
      try {
        await NavigationBar.setVisibilityAsync(on ? "hidden" : "visible");
        await NavigationBar.setBehaviorAsync("overlay-swipe");
      } catch {}
    }
  }, []);

  const { controlsVisible, toggleControls, showControls } = useAutoHide(isPlaying);

  const togglePlay = useCallback(() => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player]);

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.min(seconds, duration));
      player.currentTime = clamped;
      setCurrentTime(clamped);
      onTimeUpdate?.(clamped);
    },
    [player, duration, onTimeUpdate]
  );

  const seekRelative = useCallback(
    (deltaSecs: number) => {
      const newTime = Math.max(0, Math.min(currentTime + deltaSecs, duration));
      seek(newTime);
    },
    [seek, currentTime, duration]
  );

  const toggleMute = useCallback(() => {
    player.muted = !player.muted;
  }, [player]);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      player.playbackRate = rate;
    },
    [player]
  );

  const handleToggleFullscreen = useCallback(async () => {
    const entering = !isFullscreen;
    if (Platform.OS !== "web") {
      if (entering) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else {
        await ScreenOrientation.unlockAsync();
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await setImmersive(entering);
    setIsFullscreen(entering);
  }, [isFullscreen, setImmersive]);

  const handleSkipBack = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    seekRelative(-10);
  }, [seekRelative]);

  const handleSkipForward = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    seekRelative(10);
  }, [seekRelative]);

  const handleSeekStart = useCallback(
    (_t: number) => {
      isSeeking.current = true;
      showControls();
    },
    [showControls]
  );

  const handleSeekChange = useCallback((t: number) => {
    setCurrentTime(t);
  }, []);

  const handleSeekEnd = useCallback(
    (t: number) => {
      isSeeking.current = false;
      seek(t);
    },
    [seek]
  );

  const retry = useCallback(() => {
    setHasError(false);
    player.play();
  }, [player]);

  const handlePiP = useCallback(() => {
    if (Platform.OS === "web") return;
    try {
      const view = videoViewRef.current as any;
      if (isPiP) {
        view?.stopPictureInPicture?.();
        setIsPiP(false);
      } else {
        view?.startPictureInPicture?.();
        setIsPiP(true);
      }
    } catch {
      Alert.alert(
        "Picture in Picture",
        "Press the Home button while playing to enter PiP mode automatically."
      );
    }
  }, [isPiP]);

  const handleAirPlay = useCallback(() => {
    Alert.alert(
      "AirPlay",
      "AirPlay is enabled. Open iOS Control Center, tap Screen Mirroring, and choose your Apple TV or AirPlay device.",
      [{ text: "Got it" }]
    );
  }, []);

  // ── Brightness init & cleanup ────────────────────────────────────────────
  useEffect(() => {
    if (Platform.OS === "web") return;
    let saved = 1;
    Brightness.getBrightnessAsync()
      .then((b) => {
        saved = b;
        setCurrentBrightness(b);
        brightnessStart.current = b;
      })
      .catch(() => {});
    return () => {
      if (hudTimer.current) clearTimeout(hudTimer.current);
      Brightness.setBrightnessAsync(saved).catch(() => {});
    };
  }, []);

  // ── HUD helper ───────────────────────────────────────────────────────────
  const showHud = useCallback(
    (type: "brightness" | "volume", value: number) => {
      setHudType(type);
      setHudValue(value);
      setHudVisible(true);
      if (hudTimer.current) clearTimeout(hudTimer.current);
      hudTimer.current = setTimeout(() => setHudVisible(false), 1500);
    },
    []
  );

  // ── Pan gesture handlers ─────────────────────────────────────────────────
  const handlePanStart = useCallback(
    (_side: "left" | "right") => {
      brightnessStart.current = currentBrightness;
      volumeStart.current = volumeLevel;
    },
    [currentBrightness, volumeLevel]
  );

  const handlePanDelta = useCallback(
    (side: "left" | "right", delta: number) => {
      if (side === "left") {
        const next = Math.max(0.05, Math.min(1, brightnessStart.current + delta));
        setCurrentBrightness(next);
        Brightness.setBrightnessAsync(next).catch(() => {});
        showHud("brightness", next);
      } else {
        const next = Math.max(0, Math.min(1, volumeStart.current + delta));
        setVolumeLevel(next);
        player.volume = next;
        showHud("volume", next);
      }
    },
    [player, showHud]
  );

  // ── Pinch zoom ───────────────────────────────────────────────────────────
  const handlePinchScale = useCallback((scale: number) => {
    // On pinch start, record current fill state
    if (scale > 1.15 && !pinchBaseIsFill.current) {
      pinchBaseIsFill.current = true;
      setIsFillMode(true);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else if (scale < 0.85 && pinchBaseIsFill.current) {
      pinchBaseIsFill.current = false;
      setIsFillMode(false);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, []);

  // ── Chromecast ───────────────────────────────────────────────────────────
  const handleCast = useCallback(async () => {
    if (!isCastAvailable()) {
      Alert.alert(
        "Chromecast",
        "Chromecast requires a native APK build and a Chromecast device on the same Wi-Fi network. It is not available in Expo Go. No login is required — just make sure your phone and Chromecast are on the same Wi-Fi."
      );
      return;
    }
    try {
      if (isCasting) {
        await endCastSession();
        setIsCasting(false);
        player.play();
      } else {
        player.pause();
        await castMedia({
          mediaUrl: uri,
          title,
          contentType: "video/mp4",
          playPosition: currentTime,
        });
        setIsCasting(true);
      }
    } catch {
      Alert.alert(
        "Chromecast",
        "No Chromecast devices found. Make sure your Chromecast is on the same Wi-Fi network."
      );
    }
  }, [isCasting, uri, title, currentTime, player]);

  const topInset = isFullscreen ? insets.top : 0;
  const bottomInset = isFullscreen ? insets.bottom : 0;
  const playerHeight = isFullscreen
    ? screenDims.height
    : screenDims.width * (9 / 16);

  const metaWidth = videoMeta?.width ?? 0;
  const metaHeight = videoMeta?.height ?? 0;
  const resolvedDuration = duration > 0 ? duration : (videoMeta?.durationSecs ?? 0);

  return (
    <>
      <StatusBar hidden={isFullscreen} />

      <View
        style={[
          styles.container,
          isFullscreen
            ? [styles.fullscreen, { width: screenDims.width, height: screenDims.height }]
            : { height: playerHeight },
        ]}
      >
        <VideoView
          ref={videoViewRef}
          player={player}
          style={styles.video}
          contentFit={contentFit}
          nativeControls={false}
          allowsPictureInPicture={Platform.OS !== "web"}
        />

        {controlsVisible && (
          <>
            <LinearGradient
              colors={[colors.gradient.topStart, colors.gradient.topEnd]}
              style={styles.gradientTop}
            />
            <LinearGradient
              colors={[colors.gradient.bottomStart, colors.gradient.bottomEnd]}
              style={styles.gradientBottom}
            />
          </>
        )}

        {hasError && (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={40} color={colors.textSecondary} />
            <Text style={styles.errorText}>Failed to load video</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={retry}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <BufferingIndicator visible={isBuffering && !hasError} />

        {!isPlaying && isReady && !isBuffering && !hasError && (
          <View style={styles.centerPlay}>
            <View style={styles.centerPlayInner}>
              <Feather name="play" size={32} color={colors.text} />
            </View>
          </View>
        )}

        {resumeFrom > 0 && !hasResumed.current && isReady && (
          <View style={styles.resumeBadge}>
            <Feather name="clock" size={12} color={colors.text} />
            <Text style={styles.resumeText}>Resuming...</Text>
          </View>
        )}

        {/* Fill mode indicator */}
        {isFillMode && controlsVisible && (
          <View style={styles.fillBadge}>
            <Feather name="crop" size={12} color={colors.text} />
            <Text style={styles.fillBadgeText}>Fill</Text>
          </View>
        )}

        <SubtitleOverlay
          text={currentSubtitle}
          bottomOffset={isFullscreen ? 100 : 80}
        />

        <GestureLayer
          onTap={toggleControls}
          onDoubleTapLeft={() => seekRelative(-10)}
          onDoubleTapRight={() => seekRelative(10)}
          onPanStart={handlePanStart}
          onPanDelta={handlePanDelta}
          onPinchScale={handlePinchScale}
        />

        <GestureHUD type={hudType} value={hudValue} visible={hudVisible} />

        <TopBar
          title={title}
          subtitle={subtitle}
          onBack={async () => {
            if (isFullscreen) {
              await ScreenOrientation.unlockAsync();
              await setImmersive(false);
              setIsFullscreen(false);
              return;
            }
            onBack?.();
          }}
          visible={controlsVisible}
          topInset={topInset}
          onAirPlayPress={Platform.OS === "ios" ? handleAirPlay : undefined}
        />

        <BottomControls
          currentTime={currentTime}
          duration={resolvedDuration}
          isPlaying={isPlaying}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          playbackRate={playbackRate}
          visible={controlsVisible}
          bottomInset={bottomInset}
          onTogglePlay={togglePlay}
          onSeekStart={handleSeekStart}
          onSeekChange={handleSeekChange}
          onSeekEnd={handleSeekEnd}
          onToggleMute={toggleMute}
          onToggleFullscreen={handleToggleFullscreen}
          onChangeRate={setPlaybackRate}
          onSkipForward={handleSkipForward}
          onSkipBack={handleSkipBack}
          onPipPress={Platform.OS !== "web" ? handlePiP : undefined}
          isPiP={isPiP}
          hasSubtitles={subtitleCues.length > 0}
          onSubtitlePress={onSubtitlePress}
          onStatsPress={() => setShowStats(true)}
          onCastPress={handleCast}
          isCasting={isCasting}
          isFillMode={isFillMode}
          onToggleFill={() => {
            setIsFillMode((prev) => !prev);
            pinchBaseIsFill.current = !isFillMode;
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
        />
      </View>

      <Modal
        visible={showStats}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStats(false)}
      >
        <TouchableOpacity
          style={styles.statsOverlay}
          activeOpacity={1}
          onPress={() => setShowStats(false)}
        >
          <View style={styles.statsSheet}>
            <View style={styles.statsHandle} />
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Video Info</Text>
              <TouchableOpacity onPress={() => setShowStats(false)}>
                <Feather name="x" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <StatRow label="Title" value={title} />
              <StatRow label="File" value={getFilename(uri)} />
              {videoMeta?.mimeType ? (
                <StatRow label="Format" value={videoMeta.mimeType} />
              ) : null}
              <StatRow label="Duration" value={resolvedDuration > 0 ? formatTime(resolvedDuration) : "Unknown"} />
              <StatRow label="Position" value={formatTime(currentTime)} />
              <StatRow
                label="Remaining"
                value={resolvedDuration > 0 ? formatTime(Math.max(0, resolvedDuration - currentTime)) : "—"}
              />
              {metaWidth > 0 && metaHeight > 0 ? (
                <StatRow label="Resolution" value={`${metaWidth} × ${metaHeight}`} />
              ) : null}
              {videoMeta?.size ? (
                <StatRow label="File Size" value={formatBytes(videoMeta.size)} />
              ) : null}
              <StatRow
                label="Speed"
                value={playbackRate === 1 ? "Normal (1×)" : `${playbackRate}×`}
              />
              <StatRow label="Audio" value={isMuted ? "Muted" : "On"} />
              <StatRow label="View Mode" value={isFillMode ? "Fill (Crop)" : "Fit (Letterbox)"} />
              {subtitle ? <StatRow label="Source" value={subtitle} /> : null}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#000",
    overflow: "hidden",
    position: "relative",
  },
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  centerPlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  centerPlayInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 4,
  },
  resumeBadge: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resumeText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  fillBadge: {
    position: "absolute",
    top: 60,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  fillBadgeText: {
    color: colors.text,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: 12,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  retryText: {
    color: colors.text,
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  statsOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  statsSheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: "75%",
  },
  statsHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceBorder,
    alignSelf: "center",
    marginBottom: 16,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsTitle: {
    color: colors.text,
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    gap: 12,
  },
  statLabel: {
    color: colors.textTertiary,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    flexShrink: 0,
  },
  statValue: {
    color: colors.text,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
    flex: 1,
  },
});
