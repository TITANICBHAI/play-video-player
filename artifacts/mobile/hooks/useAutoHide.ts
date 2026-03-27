import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_HIDE_DELAY = 3000;

export function useAutoHide(isPlaying: boolean) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearTimer();
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, AUTO_HIDE_DELAY);
    }
  }, [clearTimer, isPlaying]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  const hideControls = useCallback(() => {
    clearTimer();
    setControlsVisible(false);
  }, [clearTimer]);

  const toggleControls = useCallback(() => {
    if (controlsVisible) {
      hideControls();
    } else {
      showControls();
    }
  }, [controlsVisible, showControls, hideControls]);

  useEffect(() => {
    if (isPlaying && controlsVisible) {
      scheduleHide();
    } else if (!isPlaying) {
      clearTimer();
      setControlsVisible(true);
    }
    return clearTimer;
  }, [isPlaying, controlsVisible, scheduleHide, clearTimer]);

  return {
    controlsVisible,
    showControls,
    hideControls,
    toggleControls,
  };
}
