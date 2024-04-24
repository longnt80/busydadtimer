import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

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
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(async () => {
    vi.resetAllMocks();
  });

  it("shows the countdown correctly with user's interactions", async () => {
    render(<TimerComponent initialSeconds={10} />);
    const user = userEvent.setup();
    // Initial render
    expect(screen.getByTestId("remaining-seconds").textContent).toEqual("10");

    // Start the timer
    await user.click(screen.getByTestId("start-btn"));
    // Fast-forward time by another 2 second
    await vi.advanceTimersByTime(2000);
    expect(screen.getByTestId("remaining-seconds").textContent).toBe("8");

    // Stop the timer
    await user.click(screen.getByTestId("stop-btn"));
    // Fast-forward time by another 1 second
    await vi.advanceTimersByTime(1000);
    // Check remaining seconds after stopping
    expect(screen.getByTestId("remaining-seconds").textContent).toBe("8");

    // Reset the timer
    await user.click(screen.getByTestId("reset-btn"));

    // Check remaining seconds after reset
    expect(screen.getByTestId("remaining-seconds").textContent).toBe("10");
  });
});
