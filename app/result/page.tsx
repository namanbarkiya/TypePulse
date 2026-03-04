import { ResultCard } from "@/components/ResultCard";

interface Props {
  searchParams: Promise<{ wpm?: string; acc?: string; cat?: string; title?: string }>;
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const wpm = Math.max(0, parseInt(params.wpm ?? "0", 10));
  const accuracy = Math.min(100, Math.max(0, parseInt(params.acc ?? "100", 10)));
  const category = params.cat ?? "ai-news";
  const title = params.title ?? "";

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-12">
      <ResultCard wpm={wpm} accuracy={accuracy} category={category} articleTitle={title} />
    </main>
  );
}
