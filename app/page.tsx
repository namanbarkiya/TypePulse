import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlayClient } from "@/components/PlayClient";
import { getCategory } from "@/lib/categories";
import { fetchArticles } from "@/lib/news";

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const slug = cat ?? "ai-news";
  const category = getCategory(slug);

  if (!category) redirect("/?cat=ai-news");

  const articles = await fetchArticles(category, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header currentCategory={slug} />
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <PlayClient articles={articles} category={slug} />
      </main>
      <Footer />
    </div>
  );
}
