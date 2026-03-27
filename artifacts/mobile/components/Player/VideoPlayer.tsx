import * as Haptics from "expo-haptics";
import * as ScreenOrientation from "expo-screen-orientation";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
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
import { BufferingIndicator } from "./BufferingIndicator";
import { BottomControls } from "./BottomControls";
import { GestureLayer } from "./GestureLayer";
import { TopBar } from "./TopBar";
import { Feather } from "@expo/vector-icons";

interface VideoPlayerProps {
  uri: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  autoPlay?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PLAYER_HEIGHT = SCREEN_WIDTH * (9 / 16);

export function VideoPlayer({
  uri,
  title,
  subtitle,
  onBack,
  autoPlay = false,
}: VideoPlayerProps) {
  const insets = useSafeAreaInsets();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [hasError, setHasError] = useState(false);
  const isSeeking = useRef(false);

  const player = useVideoPlayer(uri, (p) => {
    p.timeUpdateEventInterval = 0.5;
    if (autoPlay) {
      p.play();
    }
  });

  useEffect(() => {
    const playingSub = player.addListener("playingChange", (evt) => {
      setIsPlaying(evt.isPlaying);
    });
    const timeSub = player.addListener("timeUpdate", (evt) => {
      if (!isSeeking.current) {
        setCurrentTime(evt.currentTime);
      }
    });
    const statusSub = player.addListener("statusChange", (evt) => {
      if (evt.status === "readyToPlay") {
        setDuration(player.duration);
        setIsBuffering(false);
        setHasError(false);
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
  }, [player]);

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
    },
    [player, duration]
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
    if (Platform.OS !== "web") {
      if (!isFullscreen) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsFullscreen((prev) => !prev);
  }, [isFullscreen]);

  const handleSkipBack = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    seekRelative(-10);
  }, [seekRelative]);

  const handleSkipForward = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    seekRelative(10);
  }, [seekRelative]);

  const handleSeekStart = useCallback(
    (t: number) => {
      isSeeking.current = true;
      showControls();
    },
    [showControls]
  );

  const handleSeekChange = useCallback(
    (t: number) => {
      setCurrentTime(t);
    },
    []
  );

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

  const topInset = isFullscreen ? insets.top : 0;
  const bottomInset = isFullscreen ? insets.bottom : 0;
  const playerHeight = isFullscreen ? Dimensions.get("window").height : PLAYER_HEIGHT;

  return (
    <View
      style={[
        styles.container,
        isFullscreen ? styles.fullscreen : { height: playerHeight },
      ]}
    >
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />

      {/* Gradient overlays */}
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

      {/* Error state */}
      {hasError && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={40} color={colors.textSecondary} />
          <Text style={styles.errorText}>Failed to load video</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={retry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Buffering */}
      <BufferingIndicator visible={isBuffering && !hasError} />

      {/* Center play button */}
      {!isPlaying && !isBuffering && !hasError && (
        <View style={styles.centerPlay}>
          <View style={styles.centerPlayInner}>
            <Feather name="play" size={32} color={colors.text} />
          </View>
        </View>
      )}

      {/* Gesture layer */}
      <GestureLayer
        onTap={toggleControls}
        onDoubleTapLeft={() => seekRelative(-10)}
        onDoubleTapRight={() => seekRelative(10)}
      />

      <TopBar
        title={title}
        subtitle={subtitle}
        onBack={onBack ?? (() => {})}
        visible={controlsVisible}
        topInset={topInset}
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
      />
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
    right: 0,
    bottom: 0,
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
