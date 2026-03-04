"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PlayError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Play page error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-mono text-muted-foreground text-sm">couldn&apos;t load today&apos;s news</p>
        <p className="font-mono text-xs text-muted-foreground/60">
          Check your API keys in .env.local or try again.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="font-mono text-sm border border-white/20 rounded px-4 py-2 hover:border-white/50 transition-colors"
        >
          Retry
        </button>
        <Link
          href="/"
          className="font-mono text-sm border border-white/20 rounded px-4 py-2 hover:border-white/50 transition-colors"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
