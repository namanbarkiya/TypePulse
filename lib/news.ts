import { Category } from "./categories";

export interface Article {
  id: string;
  title: string;
  body: string;
  source: string;
  url: string;
  publishedAt: string;
}

// ── Sanitisation ────────────────────────────────────────────────────────────

/**
 * Strips non-typeable characters and normalises text to clean ASCII.
 * Returns a string ≤ 280 chars, ending on a word boundary.
 */
export function normaliseToTypingText(raw: string): string {
  let text = raw
    // em dashes, en dashes → hyphen
    .replace(/[\u2013\u2014]/g, "-")
    // smart quotes → straight quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // ellipsis character → three dots
    .replace(/\u2026/g, "...")
    // HTML entities (basic)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    // NewsAPI truncation artifact
    .replace(/\[\+\d+ chars\]/g, "")
    // Parenthetical URLs
    .replace(/\(https?:\/\/[^\)]+\)/g, "")
    // Strip remaining non-ASCII (keep standard printable ASCII 32–126)
    .replace(/[^\x20-\x7E]/g, "")
    // Collapse multiple spaces / trim
    .replace(/\s+/g, " ")
    .trim();

  // Truncate to ≤ 280 chars on a word boundary
  if (text.length > 280) {
    text = text.slice(0, 280);
    const lastSpace = text.lastIndexOf(" ");
    if (lastSpace > 200) {
      text = text.slice(0, lastSpace);
    }
    // Remove trailing punctuation that looks incomplete
    text = text.replace(/[,;:\-–]$/, "").trim();
  }

  return text;
}

// ── NewsAPI ─────────────────────────────────────────────────────────────────

interface NewsAPIArticle {
  title: string | null;
  description: string | null;
  content: string | null;
  source: { name: string };
  url: string;
  publishedAt: string;
}

export async function fetchFromNewsAPI(category: Category): Promise<Article[]> {
  const key = process.env.NEWSAPI_KEY;
  if (!key) return [];

  const params = new URLSearchParams({ apiKey: key, pageSize: "10", language: "en" });

  if (category.query) {
    params.set("q", category.query);
    if (category.sources) params.set("sources", category.sources);
    const url = `https://newsapi.org/v2/everything?${params}`;
    return parseNewsAPIResponse(await safeFetch(url));
  } else if (category.category) {
    params.set("category", category.category);
    const url = `https://newsapi.org/v2/top-headlines?${params}`;
    return parseNewsAPIResponse(await safeFetch(url));
  }

  return [];
}

function parseNewsAPIResponse(data: unknown): Article[] {
  if (!data || typeof data !== "object") return [];
  const d = data as { articles?: NewsAPIArticle[] };
  if (!Array.isArray(d.articles)) return [];

  return d.articles
    .filter((a) => a.title && a.title !== "[Removed]")
    .map((a, i) => {
      const raw = [a.title ?? "", a.description ?? ""].filter(Boolean).join(" ");
      const body = normaliseToTypingText(raw);
      return {
        id: `newsapi-${i}-${Date.now()}`,
        title: normaliseToTypingText(a.title ?? ""),
        body,
        source: a.source?.name ?? "Unknown",
        url: a.url,
        publishedAt: a.publishedAt,
      };
    })
    .filter((a) => a.body.length >= 20);
}

// ── GNews ───────────────────────────────────────────────────────────────────

interface GNewsArticle {
  title: string;
  description: string | null;
  source: { name: string };
  url: string;
  publishedAt: string;
}

export async function fetchFromGNews(category: Category): Promise<Article[]> {
  const key = process.env.GNEWS_KEY;
  if (!key) return [];

  const params = new URLSearchParams({
    token: key,
    lang: "en",
    max: "10",
    ...(category.gnewsTopic ? { topic: category.gnewsTopic } : {}),
    ...(category.query ? { q: category.query } : {}),
  });

  const url = `https://gnews.io/api/v4/${category.gnewsTopic ? "top-headlines" : "search"}?${params}`;
  const data = await safeFetch(url);
  if (!data || typeof data !== "object") return [];

  const d = data as { articles?: GNewsArticle[] };
  if (!Array.isArray(d.articles)) return [];

  return d.articles
    .map((a, i) => {
      const raw = [a.title, a.description ?? ""].filter(Boolean).join(" ");
      const body = normaliseToTypingText(raw);
      return {
        id: `gnews-${i}-${Date.now()}`,
        title: normaliseToTypingText(a.title),
        body,
        source: a.source?.name ?? "Unknown",
        url: a.url,
        publishedAt: a.publishedAt,
      };
    })
    .filter((a) => a.body.length >= 20);
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function fetchArticles(category: Category, count = 5): Promise<Article[]> {
  // Try NewsAPI first, fall back to GNews
  let articles = await fetchFromNewsAPI(category);
  if (articles.length < count) {
    const gnews = await fetchFromGNews(category);
    // Merge, deduplicate by title prefix
    const seen = new Set(articles.map((a) => a.title.slice(0, 30)));
    for (const a of gnews) {
      if (!seen.has(a.title.slice(0, 30))) {
        articles.push(a);
        seen.add(a.title.slice(0, 30));
      }
    }
  }
  return articles.slice(0, count);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function safeFetch(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
