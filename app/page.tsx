import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-10 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-mono text-muted-foreground tracking-widest">
          TypePulse
        </h1>
        <p className="text-sm text-muted-foreground">
          Type the news. Learn while you type.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/play/ai-news"
          className="group flex flex-col items-center gap-3 border border-border rounded-lg px-8 py-6 hover:border-white/30 transition-colors"
        >
          <span className="text-2xl">🤖</span>
          <span className="text-sm font-mono text-foreground">AI News</span>
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            → Start
          </span>
        </Link>

        <Link
          href="/play/current-affairs"
          className="group flex flex-col items-center gap-3 border border-border rounded-lg px-8 py-6 hover:border-white/30 transition-colors"
        >
          <span className="text-2xl">🌍</span>
          <span className="text-sm font-mono text-foreground">
            Current Affairs
          </span>
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            → Start
          </span>
        </Link>
      </div>
    </main>
  );
}
