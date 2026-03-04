"use client";

import { useState } from "react";
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

export function PlayClient({ articles, category }: Props) {
  const [index, setIndex] = useState(0);

  const articleList = articles.length > 0 ? articles : [FALLBACK];
  const current = articleList[index % articleList.length];

  function handleSkip() {
    setIndex((i) => i + 1);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-12">
      <TypingArea article={current} category={category} onSkip={handleSkip} />
    </main>
  );
}
