import { describe, expect, it } from "vitest";
import { CATEGORIES, getCategory } from "./categories";

describe("CATEGORIES", () => {
  it("has ai-news category with query and sources", () => {
    const cat = CATEGORIES["ai-news"];
    expect(cat.slug).toBe("ai-news");
    expect(cat.label).toBe("AI News");
    expect(cat.query).toBeTruthy();
    expect(cat.sources).toBeTruthy();
  });

  it("has current-affairs category with category field", () => {
    const cat = CATEGORIES["current-affairs"];
    expect(cat.slug).toBe("current-affairs");
    expect(cat.label).toBe("Current Affairs");
    expect(cat.category).toBe("general");
  });

  it("exactly two categories defined", () => {
    expect(Object.keys(CATEGORIES)).toHaveLength(2);
  });
});

describe("getCategory", () => {
  it("returns category for valid slug", () => {
    expect(getCategory("ai-news")).toBeDefined();
    expect(getCategory("current-affairs")).toBeDefined();
  });

  it("returns undefined for unknown slug", () => {
    expect(getCategory("unknown-slug")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getCategory("")).toBeUndefined();
  });
});
