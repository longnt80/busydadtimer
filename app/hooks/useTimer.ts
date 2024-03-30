import { useState, useRef, useEffect } from "react";

export function useTimer(countdownSeconds: number) {
  const [remainingSeconds, setRemainingSeconds] = useState(countdownSeconds);
  const timerIDRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousTimeRef = useRef<number | undefined>(undefined);

  function timer() {
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
  }

  function start() {
    if (timerIDRef.current) return;

    timer();
  }

  function stop() {
    if (timerIDRef.current) {
      clearInterval(timerIDRef.current);
      timerIDRef.current = null;
    }
  }

  function reset() {
    stop();
    setRemainingSeconds(countdownSeconds);
  }

  useEffect(() => {
    if (remainingSeconds <= 0) {
      reset();
    }
  }, [remainingSeconds]);

  return {
    remainingSeconds,
    start,
    stop,
    reset,
  };
}
