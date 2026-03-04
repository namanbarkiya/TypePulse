import { notFound } from "next/navigation";
import { PlayClient } from "./PlayClient";
import { getCategory } from "@/lib/categories";
import { fetchArticles } from "@/lib/news";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function PlayPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const articles = await fetchArticles(category, 5);

  return <PlayClient articles={articles} category={categorySlug} />;
}
