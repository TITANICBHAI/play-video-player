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
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { useAutoHide } from "@/hooks/useAutoHide";
import { SubtitleCue, getCurrentSubtitle } from "@/utils/srtParser";
import { BufferingIndicator } from "./BufferingIndicator";
import { BottomControls } from "./BottomControls";
import { GestureLayer } from "./GestureLayer";
import { SubtitleOverlay } from "./SubtitleOverlay";
import { TopBar } from "./TopBar";
import { Feather } from "@expo/vector-icons";

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
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PLAYER_HEIGHT = SCREEN_WIDTH * (9 / 16);

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
  const isSeeking = useRef(false);
  const hasResumed = useRef(false);
  const videoViewRef = useRef<VideoView>(null);

  const player = useVideoPlayer(uri, (p) => {
    p.timeUpdateEventInterval = 1;
    if (autoPlay) p.play();
  });

  const currentSubtitle =
    subtitleCues.length > 0 ? getCurrentSubtitle(subtitleCues, currentTime) : null;

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
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
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
      if (isPiP) {
        (videoViewRef.current as any)?.stopPictureInPicture?.();
        setIsPiP(false);
      } else {
        (videoViewRef.current as any)?.startPictureInPicture?.();
        setIsPiP(true);
      }
    } catch {
      Alert.alert(
        "Picture in Picture",
        "Swipe up from the player or press the Home button to activate PiP automatically."
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

  const topInset = isFullscreen ? insets.top : 0;
  const bottomInset = isFullscreen ? insets.bottom : 0;
  const playerHeight = isFullscreen
    ? screenDims.height
    : screenDims.width * (9 / 16);

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
          contentFit="contain"
          nativeControls={false}
          allowsFullscreen={false}
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

        <SubtitleOverlay
          text={currentSubtitle}
          bottomOffset={isFullscreen ? 100 : 80}
        />

        <GestureLayer
          onTap={toggleControls}
          onDoubleTapLeft={() => seekRelative(-10)}
          onDoubleTapRight={() => seekRelative(10)}
        />

        <TopBar
          title={title}
          subtitle={subtitle}
          onBack={async () => {
            if (isFullscreen) {
              await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
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
          duration={duration}
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
        />
      </View>
    </>
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
});
