import { createRemixStub } from "@remix-run/testing";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { userEvent } from "@testing-library/user-event";
import Workout from "./workout.$level.$movement";

window.HTMLMediaElement.prototype.play = () =>
  new Promise(() => "sound played");

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(async () => {
  vi.useRealTimers();
});

describe("Workout", async () => {
  it("renders the Workout component", async () => {
    const user = userEvent.setup();
    const RemixStub = createRemixStub([
      {
        path: "/",
        Component: Workout,
        loader() {
          return 275;
        },
      },
    ]);
    render(<RemixStub />);
    await screen.findByText("Start");
    expect(screen.getByTestId("reps-completed")).toHaveTextContent(
      "0/275 reps"
    );
    await user.click(screen.getByRole("button", { name: /Start/i }));

    act(() => vi.advanceTimersByTime(4900));
    expect(screen.getByTestId("reps-completed")).toHaveTextContent(
      "0/275 reps"
    );
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByTestId("reps-completed")).toHaveTextContent(
      "1/275 reps"
    );
    act(() => vi.advanceTimersByTime(4000));
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByTestId("reps-completed")).toHaveTextContent(
      "3/275 reps"
    );
    screen.debug();
  });
});
