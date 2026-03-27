import { useVideoPlayer, VideoPlayer as ExpoVideoPlayer } from "expo-video";
import { useCallback, useRef, useState } from "react";

export interface PlayerState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  isBuffering: boolean;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  hasError: boolean;
}

const INITIAL_STATE: PlayerState = {
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  isBuffering: false,
  playbackRate: 1,
  volume: 1,
  isMuted: false,
  hasError: false,
};

export function usePlayerControls(uri: string) {
  const [state, setState] = useState<PlayerState>(INITIAL_STATE);
  const isSeeking = useRef(false);

  const player = useVideoPlayer(uri, (p) => {
    p.play();
  });

  // Poll for updates via event listeners
  const setupListeners = useCallback(() => {
    const statusSub = player.addListener("statusChange", (newStatus) => {
      if (newStatus.status === "error") {
        setState((prev) => ({ ...prev, hasError: true }));
      }
    });
    const playingSub = player.addListener("playingChange", (evt) => {
      setState((prev) => ({ ...prev, isPlaying: evt.isPlaying }));
    });
    return () => {
      statusSub.remove();
      playingSub.remove();
    };
  }, [player]);

  const togglePlay = useCallback(() => {
    if (player.playing) {
      player.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      player.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, [player]);

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.min(seconds, state.duration));
      player.currentTime = clamped;
      setState((prev) => ({ ...prev, currentTime: clamped }));
    },
    [player, state.duration]
  );

  const seekRelative = useCallback(
    (deltaSecs: number) => {
      const newTime = Math.max(0, Math.min(state.currentTime + deltaSecs, state.duration));
      seek(newTime);
    },
    [seek, state.currentTime, state.duration]
  );

  const setPlaybackRate = useCallback(
    (rate: number) => {
      player.playbackRate = rate;
      setState((prev) => ({ ...prev, playbackRate: rate }));
    },
    [player]
  );

  const toggleMute = useCallback(() => {
    const newMuted = !state.isMuted;
    player.muted = newMuted;
    setState((prev) => ({ ...prev, isMuted: newMuted }));
  }, [player, state.isMuted]);

  const setCurrentTime = useCallback((t: number) => {
    setState((prev) => ({ ...prev, currentTime: t }));
  }, []);

  const setDuration = useCallback((d: number) => {
    setState((prev) => ({ ...prev, duration: d }));
  }, []);

  const setIsBuffering = useCallback((b: boolean) => {
    setState((prev) => ({ ...prev, isBuffering: b }));
  }, []);

  const setSeeking = useCallback((s: boolean) => {
    isSeeking.current = s;
  }, []);

  const retry = useCallback(() => {
    setState((prev) => ({ ...prev, hasError: false }));
    player.play();
  }, [player]);

  return {
    player,
    state,
    setState,
    setupListeners,
    togglePlay,
    seek,
    seekRelative,
    setPlaybackRate,
    toggleMute,
    setCurrentTime,
    setDuration,
    setIsBuffering,
    setSeeking,
    retry,
  };
}
