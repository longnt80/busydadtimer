import { useState, useRef, useEffect, useCallback } from "react";

export function useTimer(countdownSeconds: number) {
  const [remainingSeconds, setRemainingSeconds] = useState(countdownSeconds);
  const timerIDRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousTimeRef = useRef<number | undefined>(undefined);

  const timer = useCallback(() => {
    const now = Date.now();
    let elapsedTime;

    if (!previousTimeRef.current) {
      previousTimeRef.current = now;
      elapsedTime = 0;
    } else {
      elapsedTime = now - previousTimeRef.current;
    }

    if (elapsedTime >= 1000) {
      previousTimeRef.current = now;

      setRemainingSeconds((currentSecondsInSet) => {
        return --currentSecondsInSet;
      });
    }

    timerIDRef.current = setTimeout(() => timer(), 100);
  }, []);

  const start = useCallback(() => {
    if (timerIDRef.current) return;

    timer();
  }, [timer]);

  function stop() {
    if (timerIDRef.current) {
      clearInterval(timerIDRef.current);
      timerIDRef.current = null;
    }
  }

  const reset = useCallback(() => {
    stop();
    setRemainingSeconds(countdownSeconds);
    previousTimeRef.current = undefined;
  }, [countdownSeconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      reset();
    }
  }, [remainingSeconds, reset]);

  return {
    remainingSeconds,
    start,
    stop,
    reset,
  };
}
