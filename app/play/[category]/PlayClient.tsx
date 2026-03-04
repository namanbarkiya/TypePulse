"use client";

import { useEffect, useRef, useState } from "react";
import { TypingArea } from "@/components/TypingArea";
import type { Article } from "@/lib/news";

interface Props {
  articles: Article[];
  category: string;
}

const FALLBACK: Article = {
  id: "fallback",
  title: "No articles available",
  body: "The quick brown fox jumps over the lazy dog. Add your API keys to load real news.",
  source: "TypePulse",
  url: "",
  publishedAt: new Date().toISOString(),
};

async function loadArticles(category: string): Promise<Article[]> {
  const res = await fetch(`/api/news?category=${category}&t=${Date.now()}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.articles ?? [];
}

export function PlayClient({ articles: initialArticles, category }: Props) {
  const [articles, setArticles] = useState<Article[]>(
    initialArticles.length > 0 ? initialArticles : [FALLBACK]
  );
  const [index, setIndex] = useState(0);
  const prefetchedRef = useRef<Article[] | null>(null);
  const prefetchingRef = useRef(false);

  const current = articles[index % articles.length];
  const isNearEnd = index >= articles.length - 2;

  // Prefetch next batch when user is on the second-to-last article
  useEffect(() => {
    if (!isNearEnd || prefetchingRef.current || prefetchedRef.current) return;
    prefetchingRef.current = true;
    loadArticles(category).then((fresh) => {
      if (fresh.length > 0) prefetchedRef.current = fresh;
      prefetchingRef.current = false;
    });
  }, [isNearEnd, category]);

  function handleSkip() {
    const next = index + 1;
    // If we've exhausted current batch and have prefetched data, swap in
    if (next >= articles.length && prefetchedRef.current) {
      setArticles(prefetchedRef.current);
      prefetchedRef.current = null;
      setIndex(0);
    } else {
      setIndex(next);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-12">
      <TypingArea article={current} category={category} onSkip={handleSkip} />
    </main>
  );
}
