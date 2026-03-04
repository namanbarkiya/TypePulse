"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CharDisplay } from "./CharDisplay";
import { StatsBar } from "./StatsBar";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import type { Article } from "@/lib/news";

// Each line is exactly this tall. Must match lineHeight style on the text div.
const LINE_HEIGHT_REM = 3.25;

/** Split text into word tokens + space tokens, each with their start index. */
function buildWordTokens(text: string): { word: string; start: number }[] {
  const tokens: { word: string; start: number }[] = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === " ") {
      tokens.push({ word: " ", start: i });
      i++;
    } else {
      const start = i;
      while (i < text.length && text[i] !== " ") i++;
      tokens.push({ word: text.slice(start, i), start });
    }
  }
  return tokens;
}

interface TypingAreaProps {
  article: Article;
  category: string;
  onSkip: () => void;
}

export function TypingArea({ article, category, onSkip }: TypingAreaProps) {
  const router = useRouter();
  const { charStates, typedCount, wpm, accuracy, isStarted, isFinished, reset } =
    useTypingEngine(article.body);

  const textRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const activeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mark cursor as active on each keystroke, clear after 500ms idle
  useEffect(() => {
    if (!isStarted) return;
    setIsTypingActive(true);
    if (activeTimerRef.current) clearTimeout(activeTimerRef.current);
    activeTimerRef.current = setTimeout(() => setIsTypingActive(false), 500);
    return () => { if (activeTimerRef.current) clearTimeout(activeTimerRef.current); };
  }, [typedCount, isStarted]);

  // Recompute scroll offset whenever typedCount changes
  useEffect(() => {
    if (!textRef.current) return;
    const cursorEl = textRef.current.querySelector<HTMLElement>("[data-cursor='true']");
    if (!cursorEl) return;

    const lh = parseFloat(getComputedStyle(textRef.current).lineHeight);
    if (!lh) return;

    // Which visual line is the cursor on?
    const cursorLine = Math.floor(cursorEl.offsetTop / lh);

    // Keep cursor on line index 1 (second visible row), snapped to line boundary
    const offset = Math.max(0, cursorLine - 1) * lh;
    setTranslateY(offset);
  }, [typedCount]);

  // Reset scroll when article changes
  useEffect(() => {
    setTranslateY(0);
  }, [article.id]);

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

  // Tab to skip
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

      {/* Source + title */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
          {article.source}
        </p>
        <p className="text-sm text-muted-foreground font-mono leading-relaxed">
          {article.title}
        </p>
      </div>

      {/* 3-line viewport — overflow hidden, text translates upward */}
      <div
        className="overflow-hidden select-none w-full"
        style={{ height: `${LINE_HEIGHT_REM * 3}rem` }}
        aria-label="Typing area"
      >
        <div
          ref={textRef}
          className="font-mono text-xl tracking-wide w-full"
          style={{
            lineHeight: `${LINE_HEIGHT_REM}rem`,
            transform: `translateY(-${translateY}px)`,
            transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Render word-by-word so CSS never splits a word across lines */}
          {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
          {useMemo(() => buildWordTokens(article.body), [article.id]).map(({ word, start }) =>
            word === " " ? (
              <CharDisplay
                key={start}
                char=" "
                state={charStates[start] ?? "pending"}
                isCursor={start === typedCount}
                isTypingActive={isTypingActive}
              />
            ) : (
              <span key={start} className="inline-block">
                {word.split("").map((char, ci) => (
                  <CharDisplay
                    key={start + ci}
                    char={char}
                    state={charStates[start + ci] ?? "pending"}
                    isCursor={start + ci === typedCount}
                    isTypingActive={isTypingActive}
                  />
                ))}
              </span>
            )
          )}
        </div>
      </div>

      {/* Hint & shortcuts */}
      <div className="flex justify-between text-xs text-muted-foreground font-mono">
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

      <p className="text-xs text-muted-foreground text-center md:hidden border border-yellow-400/20 rounded px-3 py-2 bg-yellow-400/5">
        LearnKeys works best on a physical keyboard
      </p>
    </div>
  );
}
