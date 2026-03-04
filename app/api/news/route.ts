import { NextRequest, NextResponse } from "next/server";
import { getCategory } from "@/lib/categories";
import { fetchArticles } from "@/lib/news";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category") ?? "ai-news";

  const category = getCategory(categorySlug);
  if (!category) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  try {
    const articles = await fetchArticles(category, 5);
    return NextResponse.json({ articles }, { headers: { "Cache-Control": "s-maxage=600" } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch articles", articles: [] }, { status: 500 });
  }
}
