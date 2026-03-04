import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTypingEngine } from "./useTypingEngine";

describe("useTypingEngine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initialises with all chars pending", () => {
    const { result } = renderHook(() => useTypingEngine("hello"));
    expect(result.current.charStates).toEqual([
      "pending",
      "pending",
      "pending",
      "pending",
      "pending",
    ]);
    expect(result.current.isStarted).toBe(false);
    expect(result.current.isFinished).toBe(false);
    expect(result.current.typedCount).toBe(0);
  });

  it("starts timer on first keypress", () => {
    const { result } = renderHook(() => useTypingEngine("hello"));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));
    });
    expect(result.current.isStarted).toBe(true);
    expect(result.current.typedCount).toBe(1);
  });

  it("marks correct chars as correct", () => {
    const { result } = renderHook(() => useTypingEngine("hi"));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));
    });
    expect(result.current.charStates[0]).toBe("correct");
  });

  it("marks incorrect chars as incorrect", () => {
    const { result } = renderHook(() => useTypingEngine("hi"));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "x", bubbles: true }));
    });
    expect(result.current.charStates[0]).toBe("incorrect");
  });

  it("backspace reverts last char to pending", () => {
    const { result } = renderHook(() => useTypingEngine("hi"));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));
    });
    expect(result.current.charStates[0]).toBe("correct");
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true }));
    });
    expect(result.current.charStates[0]).toBe("pending");
    expect(result.current.typedCount).toBe(0);
  });

  it("finishes when all chars typed", () => {
    const { result } = renderHook(() => useTypingEngine("hi"));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "i", bubbles: true }));
    });
    expect(result.current.isFinished).toBe(true);
  });

  it("reset restores initial state", () => {
    const { result } = renderHook(() => useTypingEngine("hi"));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));
    });
    expect(result.current.isStarted).toBe(true);
    act(() => {
      result.current.reset();
    });
    expect(result.current.isStarted).toBe(false);
    expect(result.current.typedCount).toBe(0);
    expect(result.current.charStates).toEqual(["pending", "pending"]);
  });

  it("Escape key resets session", () => {
    const { result } = renderHook(() => useTypingEngine("hi"));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));
    });
    expect(result.current.isStarted).toBe(true);
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(result.current.isStarted).toBe(false);
  });

  it("calculates 100% accuracy for all correct chars", () => {
    const { result } = renderHook(() => useTypingEngine("hi"));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "i", bubbles: true }));
    });
    expect(result.current.accuracy).toBe(100);
  });

  it("accuracy drops below 100 for incorrect chars", () => {
    const { result } = renderHook(() => useTypingEngine("hi"));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "x", bubbles: true }));
    });
    expect(result.current.accuracy).toBeLessThan(100);
  });
});
