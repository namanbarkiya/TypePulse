"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, CategorySlug } from "@/lib/categories";

interface HeaderProps {
  currentCategory: string;
  stars?: number;
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function Header({ currentCategory, stars }: HeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = CATEGORIES[currentCategory as CategorySlug] ?? CATEGORIES["ai-news"];

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
      <Link
        href="/"
        className="font-mono text-sm text-muted-foreground tracking-widest hover:text-white transition-colors"
      >
        LearnKeys
      </Link>

      <div className="flex items-center gap-3">
        {/* GitHub link */}
        <a
          href="https://github.com/namanbarkiya/LearnKeys"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-white transition-colors border border-white/10 hover:border-white/20 rounded px-2.5 py-1.5"
        >
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {stars !== undefined && stars > 0 && (
            <span>{formatStars(stars)} ★</span>
          )}
          {(stars === undefined || stars === 0) && <span>Star</span>}
        </a>

        {/* Category dropdown */}
        <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="font-mono text-sm text-muted-foreground flex items-center gap-2 hover:text-white transition-colors px-3 py-1.5 rounded border border-white/10 hover:border-white/20"
        >
          {current.label}
          <span className="text-[10px] opacity-60">{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <>
            {/* Click-away overlay */}
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-2 z-20 bg-[#111] border border-white/10 rounded overflow-hidden min-w-[180px] shadow-xl">
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    router.push(`/?cat=${cat.slug}`);
                    setOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 font-mono text-sm transition-colors hover:bg-white/5 ${
                    cat.slug === currentCategory ? "text-white" : "text-muted-foreground"
                  }`}
                >
                  {cat.slug === currentCategory && (
                    <span className="text-yellow-400 mr-2">›</span>
                  )}
                  {cat.label}
                </button>
              ))}
            </div>
          </>
        )}
        </div>
      </div>
    </header>
  );
}
