import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, test, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import Workout from "./workout.$level.$movement";
import { sleep } from "../utils";

afterEach(async () => {
  vi.clearAllTimers();
});

describe("Workout", async () => {
  it("renders the Workout component", async () => {
    const user = userEvent.setup();
    const RemixStub = createRemixStub([
      {
        path: "/",
        Component: Workout,
        loader() {
          return 1;
        },
      },
    ]);
    render(<RemixStub />);
    await screen.findByText("Start");
    expect(screen.getByTestId("reps-completed")).toHaveTextContent("0/1 reps");
    await user.click(screen.getByRole("button", { name: /Start/i }));
    await sleep(6000);
    expect(screen.getByTestId("reps-completed")).toHaveTextContent("1/1 reps");
    // screen.debug();
  }, 10000);
});
