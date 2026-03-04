"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, CategorySlug } from "@/lib/categories";

interface HeaderProps {
  currentCategory: string;
}

export function Header({ currentCategory }: HeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = CATEGORIES[currentCategory as CategorySlug] ?? CATEGORIES["ai-news"];

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
      <Link
        href="/"
        className="font-mono text-sm text-muted-foreground tracking-widest hover:text-white transition-colors"
      >
        TypePulse
      </Link>

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
    </header>
  );
}
