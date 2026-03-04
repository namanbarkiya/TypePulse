import { describe, expect, it } from "vitest";
import { calcAccuracy, calcWPM } from "./typing";

describe("calcWPM", () => {
  it("calculates WPM correctly for known values", () => {
    // 100 correct chars in 60 seconds = 20 WPM
    expect(calcWPM(100, 60000)).toBe(20);
  });

  it("calculates WPM for 300 chars in 60 seconds = 60 WPM", () => {
    expect(calcWPM(300, 60000)).toBe(60);
  });

  it("returns 0 for zero elapsed time", () => {
    expect(calcWPM(100, 0)).toBe(0);
  });

  it("returns 0 for zero correct chars", () => {
    expect(calcWPM(0, 60000)).toBe(0);
  });

  it("returns 0 for negative elapsed time", () => {
    expect(calcWPM(100, -1000)).toBe(0);
  });

  it("rounds to nearest integer", () => {
    // 1 char / 5 / (1000/60000) = 12 WPM
    const result = calcWPM(1, 1000);
    expect(Number.isInteger(result)).toBe(true);
  });

  it("handles high WPM correctly (200 WPM = 1000 chars/min)", () => {
    expect(calcWPM(1000, 60000)).toBe(200);
  });
});

describe("calcAccuracy", () => {
  it("returns 100 when all chars are correct", () => {
    expect(calcAccuracy(50, 50)).toBe(100);
  });

  it("returns 0 when all chars are incorrect", () => {
    expect(calcAccuracy(0, 50)).toBe(0);
  });

  it("returns 100 for zero total typed", () => {
    expect(calcAccuracy(0, 0)).toBe(100);
  });

  it("calculates 80% accuracy", () => {
    expect(calcAccuracy(80, 100)).toBe(80);
  });

  it("rounds to nearest integer", () => {
    const result = calcAccuracy(1, 3); // 33.33%
    expect(result).toBe(33);
  });

  it("calculates 50% accuracy", () => {
    expect(calcAccuracy(5, 10)).toBe(50);
  });
});
