"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CharDisplay } from "./CharDisplay";
import { StatsBar } from "./StatsBar";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import type { Article } from "@/lib/news";

interface TypingAreaProps {
  article: Article;
  category: string;
  onSkip: () => void;
}

export function TypingArea({ article, category, onSkip }: TypingAreaProps) {
  const router = useRouter();
  const { charStates, typedCount, wpm, accuracy, isStarted, isFinished, reset } =
    useTypingEngine(article.body);

  // Navigate to result on finish
  useEffect(() => {
    if (!isFinished) return;
    const params = new URLSearchParams({
      wpm: String(wpm),
      acc: String(accuracy),
      cat: category,
      title: article.title,
    });
    router.push(`/result?${params}`);
  }, [isFinished, wpm, accuracy, category, article.title, router]);

  // Tab to skip article
  useEffect(() => {
    function handleTab(e: KeyboardEvent) {
      if (e.key === "Tab") {
        e.preventDefault();
        reset();
        onSkip();
      }
    }
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [reset, onSkip]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <StatsBar wpm={wpm} accuracy={accuracy} isStarted={isStarted} />

      {/* Article source + title */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
          {article.source}
        </p>
        <p className="text-sm text-muted-foreground font-mono leading-relaxed">
          {article.title}
        </p>
      </div>

      {/* Typing area */}
      <div
        className="relative font-mono text-xl leading-relaxed tracking-wide select-none"
        aria-label="Typing area"
      >
        {article.body.split("").map((char, i) => (
          <CharDisplay
            key={i}
            char={char}
            state={charStates[i] ?? "pending"}
            isCursor={i === typedCount}
          />
        ))}
        {/* Cursor at end when all typed */}
        {typedCount === article.body.length && (
          <span
            className="inline-block w-0.5 h-5 bg-yellow-400 align-middle"
            style={{ animation: "blink 1s step-end infinite" }}
          />
        )}
      </div>

      {/* Hint & shortcuts */}
      <div className="flex justify-between text-xs text-muted-foreground font-mono mt-2">
        {!isStarted ? (
          <span className="animate-pulse">Press any key to begin...</span>
        ) : (
          <span />
        )}
        <span>
          <kbd className="bg-white/5 border border-white/10 rounded px-1">Esc</kbd> reset
          {" · "}
          <kbd className="bg-white/5 border border-white/10 rounded px-1">Tab</kbd> skip
        </span>
      </div>

      {/* Mobile warning */}
      <p className="text-xs text-muted-foreground text-center md:hidden border border-yellow-400/20 rounded px-3 py-2 bg-yellow-400/5">
        TypePulse works best on a physical keyboard
      </p>
    </div>
  );
}
