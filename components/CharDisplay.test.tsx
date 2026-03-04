import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CharDisplay } from "./CharDisplay";

describe("CharDisplay", () => {
  it("renders a character", () => {
    const { container } = render(<CharDisplay char="a" state="pending" isCursor={false} />);
    expect(container.textContent).toContain("a");
  });

  it("applies gray class for pending state", () => {
    const { container } = render(<CharDisplay char="a" state="pending" isCursor={false} />);
    expect(container.firstElementChild?.className).toContain("text-gray-600");
  });

  it("applies white class for correct state", () => {
    const { container } = render(<CharDisplay char="a" state="correct" isCursor={false} />);
    expect(container.firstElementChild?.className).toContain("text-white");
  });

  it("applies red class for incorrect state", () => {
    const { container } = render(<CharDisplay char="a" state="incorrect" isCursor={false} />);
    expect(container.firstElementChild?.className).toContain("text-red-400");
  });

  it("shows cursor element when isCursor=true", () => {
    const { container } = render(<CharDisplay char="a" state="pending" isCursor={true} />);
    const cursor = container.querySelector("span > span");
    expect(cursor).not.toBeNull();
  });

  it("does not show cursor element when isCursor=false", () => {
    const { container } = render(<CharDisplay char="a" state="pending" isCursor={false} />);
    const cursor = container.querySelector("span > span");
    expect(cursor).toBeNull();
  });

  it("renders non-breaking space for space character", () => {
    const { container } = render(<CharDisplay char=" " state="pending" isCursor={false} />);
    expect(container.textContent).toBe("\u00A0");
  });
});
