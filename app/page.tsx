import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlayClient } from "@/components/PlayClient";
import { getCategory } from "@/lib/categories";
import { fetchArticles } from "@/lib/news";

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

async function getGitHubStars(): Promise<number> {
  try {
    const res = await fetch("https://api.github.com/repos/namanbarkiya/LearnKeys", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

export default async function HomePage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const slug = cat ?? "ai-news";
  const category = getCategory(slug);

  if (!category) redirect("/?cat=ai-news");

  const [articles, stars] = await Promise.all([
    fetchArticles(category, 5),
    getGitHubStars(),
  ]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header currentCategory={slug} stars={stars} />
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <PlayClient articles={articles} category={slug} />
      </main>
      <Footer />
    </div>
  );
}
