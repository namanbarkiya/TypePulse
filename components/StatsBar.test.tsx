import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatsBar } from "./StatsBar";

describe("StatsBar", () => {
  it("renders nothing when not started", () => {
    const { container } = render(<StatsBar wpm={0} accuracy={100} isStarted={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders WPM when started", () => {
    const { container } = render(<StatsBar wpm={75} accuracy={98} isStarted={true} />);
    expect(container.textContent).toContain("75");
  });

  it("renders accuracy when started", () => {
    const { container } = render(<StatsBar wpm={75} accuracy={98} isStarted={true} />);
    expect(container.textContent).toContain("98");
  });

  it("shows WPM label", () => {
    const { container } = render(<StatsBar wpm={60} accuracy={100} isStarted={true} />);
    expect(container.textContent).toContain("WPM");
  });
});
