import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";

import { useTimer } from "./useTimer";

const TimerComponent = ({ initialSeconds }: { initialSeconds: number }) => {
  const { remainingSeconds, start, stop, reset } = useTimer(initialSeconds);

  return (
    <div>
      <div data-testid="remaining-seconds">{remainingSeconds}</div>
      <button onClick={start} data-testid="start-btn">
        Start
      </button>
      <button onClick={stop} data-testid="stop-btn">
        Stop
      </button>
      <button onClick={reset} data-testid="reset-btn">
        Reset
      </button>
    </div>
  );
};

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(async () => {
    vi.resetAllMocks();
  });

  it("shows the initial total count down seconds", () => {
    const { getByTestId } = render(<TimerComponent initialSeconds={10} />);
    expect(getByTestId("remaining-seconds").textContent).toEqual("10");

    // Start the timer
    fireEvent.click(getByTestId("start-btn"));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(getByTestId("remaining-seconds").textContent).toBe("8");

    // Stop the timer
    fireEvent.click(getByTestId("stop-btn"));
    // Fast-forward time by another 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // Check remaining seconds after stopping
    expect(getByTestId("remaining-seconds").textContent).toBe("8");

    // Reset the timer
    fireEvent.click(getByTestId("reset-btn"));

    // Check remaining seconds after reset
    expect(getByTestId("remaining-seconds").textContent).toBe("10");
  });
});
