import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock news module so tests don't make real API calls
vi.mock("@/lib/news", () => ({
  fetchArticles: vi.fn().mockResolvedValue([
    {
      id: "1",
      title: "Test headline",
      body: "This is a test article about AI.",
      source: "Test",
      url: "https://test.com",
      publishedAt: "2026-01-01",
    },
  ]),
}));

import { GET } from "./route";

describe("GET /api/news", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with articles array for valid category", async () => {
    const req = new NextRequest("http://localhost:3000/api/news?category=ai-news");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("articles");
    expect(Array.isArray(body.articles)).toBe(true);
  });

  it("returns 400 for unknown category", async () => {
    const req = new NextRequest("http://localhost:3000/api/news?category=unknown");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  it("defaults to ai-news when no category param provided", async () => {
    const req = new NextRequest("http://localhost:3000/api/news");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("articles");
  });

  it("returns JSON content-type", async () => {
    const req = new NextRequest("http://localhost:3000/api/news?category=current-affairs");
    const res = await GET(req);
    expect(res.headers.get("content-type")).toContain("application/json");
  });
});
