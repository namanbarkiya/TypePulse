"use client";

import Link from "next/link";
import { toast } from "sonner";

interface ResultCardProps {
  wpm: number;
  accuracy: number;
  category: string;
  articleTitle: string;
}

export function ResultCard({ wpm, accuracy, category, articleTitle }: ResultCardProps) {
  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Copied to clipboard!");
    });
  }

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      {/* WPM */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-6xl font-mono font-bold text-white tabular-nums">{wpm}</span>
        <span className="text-sm text-muted-foreground font-mono">WPM</span>
      </div>

      {/* Accuracy */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-3xl font-mono font-semibold text-white tabular-nums">
          {accuracy}%
        </span>
        <span className="text-sm text-muted-foreground font-mono">accuracy</span>
      </div>

      {/* Article title */}
      {articleTitle && (
        <div className="max-w-md">
          <p className="text-xs text-muted-foreground font-mono mb-1">You just typed:</p>
          <p className="text-sm text-white/80 font-mono italic">&quot;{articleTitle}&quot;</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href={`/play/${category}`}
          className="font-mono text-sm border border-white/20 rounded px-4 py-2 hover:border-white/50 transition-colors"
        >
          Try another →
        </Link>
        <Link
          href="/"
          className="font-mono text-sm border border-white/20 rounded px-4 py-2 hover:border-white/50 transition-colors"
        >
          Change category
        </Link>
        <button
          onClick={handleShare}
          className="font-mono text-sm border border-white/20 rounded px-4 py-2 hover:border-white/50 transition-colors"
        >
          Share
        </button>
      </div>
    </div>
  );
}
