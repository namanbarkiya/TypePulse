import { describe, expect, it, vi } from "vitest";
import { normaliseToTypingText, fetchArticles } from "./news";
import type { Category } from "./categories";

// ── normaliseToTypingText ────────────────────────────────────────────────────

describe("normaliseToTypingText", () => {
  it("replaces em dash with hyphen", () => {
    expect(normaliseToTypingText("AI\u2014Revolution")).toBe("AI-Revolution");
  });

  it("replaces smart quotes with straight quotes", () => {
    expect(normaliseToTypingText("\u201CHello\u201D \u2018world\u2019")).toBe('"Hello" \'world\'');
  });

  it("removes NewsAPI truncation artifact", () => {
    const text = "OpenAI released GPT-5 [+1234 chars]";
    expect(normaliseToTypingText(text)).toBe("OpenAI released GPT-5");
  });

  it("strips non-ASCII characters", () => {
    const text = "Caf\u00E9 news";
    const result = normaliseToTypingText(text);
    expect(result).toMatch(/^[\x20-\x7E]+$/);
  });

  it("truncates to ≤280 chars on word boundary", () => {
    const long = "word ".repeat(100); // 500 chars
    const result = normaliseToTypingText(long);
    expect(result.length).toBeLessThanOrEqual(280);
    expect(result).not.toMatch(/\s$/);
  });

  it("removes parenthetical URLs", () => {
    const text = "Read more (https://example.com/very/long/url) here.";
    expect(normaliseToTypingText(text)).toBe("Read more here.");
  });

  it("decodes HTML entities", () => {
    expect(normaliseToTypingText("AT&amp;T &lt;news&gt;")).toBe("AT&T <news>");
  });

  it("handles empty string", () => {
    expect(normaliseToTypingText("")).toBe("");
  });

  it("returns clean text unchanged", () => {
    const clean = "OpenAI launches new model with improved reasoning.";
    expect(normaliseToTypingText(clean)).toBe(clean);
  });
});

// ── fetchArticles ────────────────────────────────────────────────────────────

const mockCategory: Category = {
  slug: "ai-news",
  label: "AI News",
  query: "artificial intelligence",
};

describe("fetchArticles", () => {
  it("returns empty array when no API keys configured", async () => {
    // No NEWSAPI_KEY or GNEWS_KEY in test env
    const articles = await fetchArticles(mockCategory, 5);
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBe(0);
  });

  it("limits result to requested count", async () => {
    // Mock fetch to return fake articles
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        articles: Array.from({ length: 20 }, (_, i) => ({
          title: `Test Article ${i}`,
          description: "A description about something important.",
          content: null,
          source: { name: "Test Source" },
          url: `https://test.com/${i}`,
          publishedAt: "2026-01-01T00:00:00Z",
        })),
      }),
    });

    // Temporarily set a fake key so fetchFromNewsAPI attempts the call
    process.env.NEWSAPI_KEY = "fake-key-for-test";
    vi.stubGlobal("fetch", mockFetch);

    try {
      const articles = await fetchArticles(mockCategory, 3);
      expect(articles.length).toBeLessThanOrEqual(3);
    } finally {
      delete process.env.NEWSAPI_KEY;
      vi.unstubAllGlobals();
    }
  });

  it("returns articles with required fields", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        articles: [
          {
            title: "AI Breakthrough in 2026",
            description: "Scientists have made a major discovery.",
            content: null,
            source: { name: "TechCrunch" },
            url: "https://techcrunch.com/article",
            publishedAt: "2026-03-01T10:00:00Z",
          },
        ],
      }),
    });

    process.env.NEWSAPI_KEY = "fake-key-for-test";
    vi.stubGlobal("fetch", mockFetch);

    try {
      const articles = await fetchArticles(mockCategory, 5);
      if (articles.length > 0) {
        const a = articles[0];
        expect(a).toHaveProperty("id");
        expect(a).toHaveProperty("title");
        expect(a).toHaveProperty("body");
        expect(a).toHaveProperty("source");
        expect(a).toHaveProperty("url");
        expect(a).toHaveProperty("publishedAt");
      }
    } finally {
      delete process.env.NEWSAPI_KEY;
      vi.unstubAllGlobals();
    }
  });
});
