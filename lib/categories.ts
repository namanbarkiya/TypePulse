export type CategorySlug = "ai-news" | "current-affairs";

export interface Category {
  slug: CategorySlug;
  label: string;
  /** NewsAPI `q` param — used for keyword search */
  query?: string;
  /** NewsAPI `sources` param (comma-separated) */
  sources?: string;
  /** NewsAPI `category` param — used for top-headlines by category */
  category?: string;
  /** GNews `topic` param */
  gnewsTopic?: string;
}

export const CATEGORIES: Record<CategorySlug, Category> = {
  "ai-news": {
    slug: "ai-news",
    label: "AI News",
    query: "artificial intelligence OR LLM OR OpenAI OR machine learning",
    sources: "techcrunch,wired,the-verge",
    gnewsTopic: "technology",
  },
  "current-affairs": {
    slug: "current-affairs",
    label: "Current Affairs",
    category: "general",
    gnewsTopic: "world",
  },
};

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES[slug as CategorySlug];
}
