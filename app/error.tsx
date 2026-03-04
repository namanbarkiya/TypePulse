"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
      <p className="font-mono text-sm text-muted-foreground">
        couldn&apos;t load today&apos;s news
      </p>
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
    </div>
  );
}
