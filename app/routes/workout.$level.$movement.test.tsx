import { createRemixStub } from "@remix-run/testing";
// eslint-disable-next-line testing-library/no-manual-cleanup
import { render, screen, act, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { userEvent } from "@testing-library/user-event";
import Workout from "./workout.$level.$movement";
import { ReactJSXElement } from "node_modules/@emotion/react/types/jsx-namespace";

window.HTMLMediaElement.prototype.play = () =>
  new Promise(() => "sound played");

function setup(jsx: ReactJSXElement) {
  return {
    user: userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    }),
    ...render(jsx),
  };
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(async () => {
  vi.clearAllMocks();
  cleanup();
});

describe("Workout", async () => {
  it("renders the Workout component", async () => {
    const RemixStub = createRemixStub([
      {
        path: "/",
        Component: Workout,
        loader() {
          return 275;
        },
      },
    ]);
    const { user } = setup(<RemixStub />);
    await screen.findByText("Start");
    await waitFor(() =>
      expect(screen.getByTestId("reps-completed")).toHaveTextContent(
        "0/275 reps"
      )
    );
    await user.click(screen.getByRole("button", { name: /Start/i }));

    await act(() => vi.advanceTimersByTime(4900));
    await waitFor(() =>
      expect(screen.getByTestId("reps-completed")).toHaveTextContent(
        "0/275 reps"
      )
    );
    await act(() => vi.advanceTimersByTime(100));
    await waitFor(() =>
      expect(screen.getByTestId("reps-completed")).toHaveTextContent(
        "1/275 reps"
      )
    );
    await act(() => vi.advanceTimersByTime(4000));
    await act(() => vi.advanceTimersByTime(4000));
    await waitFor(() =>
      expect(screen.getByTestId("reps-completed")).toHaveTextContent(
        "3/275 reps"
      )
    );
  });
});

describe("Workout level 60 navy seal", async () => {
  it("completes 60 reps in 20 minutes", async () => {
    const RemixStub = createRemixStub([
      {
        path: "/",
        Component: Workout,
        loader() {
          return 60;
        },
      },
    ]);
    const { user } = setup(<RemixStub />);
    await screen.findByText("Start");
    await waitFor(() =>
      expect(screen.getByTestId("reps-completed")).toHaveTextContent(
        "0/60 reps"
      )
    );
    await user.click(screen.getByRole("button", { name: /Start/i }));
    // Advance by 20 minutes
    await act(() => vi.advanceTimersByTime(5000));
    await waitFor(() =>
      expect(screen.getByTestId("reps-completed")).toHaveTextContent(
        "1/60 reps"
      )
    );
    const minutesInMiliseconds = 20 * (60 * 1000);
    const totalStateUpdatesEvery500Miliseconds = minutesInMiliseconds / 500;

    for (let i = totalStateUpdatesEvery500Miliseconds; i >= 0; i--) {
      // Your code here
      await act(() => vi.advanceTimersByTime(500));
    }
    await waitFor(() =>
      expect(screen.getByTestId("reps-completed")).toHaveTextContent(
        "60/60 reps"
      )
    );
  });
});
