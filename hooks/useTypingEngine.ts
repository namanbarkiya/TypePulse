"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { calcAccuracy, calcWPM, CharState } from "@/lib/typing";

export interface TypingEngineState {
  charStates: CharState[];
  typedCount: number;
  wpm: number;
  accuracy: number;
  isStarted: boolean;
  isFinished: boolean;
  reset: () => void;
}

export function useTypingEngine(targetText: string): TypingEngineState {
  const [charStates, setCharStates] = useState<CharState[]>(() =>
    Array(targetText.length).fill("pending")
  );
  const [typedCount, setTypedCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const correctCharsRef = useRef(0);
  const totalTypedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const charStatesRef = useRef<CharState[]>(Array(targetText.length).fill("pending"));
  const typedCountRef = useRef(0);

  // Reset when targetText changes
  const reset = useCallback(() => {
    const fresh: CharState[] = Array(targetText.length).fill("pending");
    charStatesRef.current = fresh;
    typedCountRef.current = 0;
    correctCharsRef.current = 0;
    totalTypedRef.current = 0;
    startTimeRef.current = null;
    setCharStates(fresh);
    setTypedCount(0);
    setWpm(0);
    setAccuracy(100);
    setIsStarted(false);
    setIsFinished(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [targetText]);

  // Reset when targetText changes
  useEffect(() => {
    reset();
  }, [reset]);

  // WPM ticker — updates every 300ms while typing
  useEffect(() => {
    if (!isStarted || isFinished) return;
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        setWpm(calcWPM(correctCharsRef.current, elapsed));
      }
    }, 300);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStarted, isFinished]);

  // Global keydown listener — no <input> element
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore modifier-only keys and shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Escape") {
        reset();
        return;
      }

      if (isFinished) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        if (typedCountRef.current === 0) return;

        const newCount = typedCountRef.current - 1;
        const newStates = [...charStatesRef.current];

        // Adjust correctChars if we're reverting a correct char
        if (newStates[newCount] === "correct") {
          correctCharsRef.current = Math.max(0, correctCharsRef.current - 1);
        }

        newStates[newCount] = "pending";
        charStatesRef.current = newStates;
        typedCountRef.current = newCount;

        setCharStates([...newStates]);
        setTypedCount(newCount);

        const acc = calcAccuracy(correctCharsRef.current, totalTypedRef.current);
        setAccuracy(acc);
        return;
      }

      // Only handle printable single characters
      if (e.key.length !== 1) return;
      e.preventDefault();

      const idx = typedCountRef.current;
      if (idx >= targetText.length) return;

      // Start timer on first keypress
      if (!isStarted) {
        startTimeRef.current = Date.now();
        setIsStarted(true);
      }

      // Space pressed mid-word → skip rest of word (mark incorrect), jump to next word
      if (e.key === " " && targetText[idx] !== " ") {
        const newStates = [...charStatesRef.current];
        // Mark remaining chars of this word as incorrect
        let i = idx;
        while (i < targetText.length && targetText[i] !== " ") {
          if (newStates[i] === "pending") {
            newStates[i] = "incorrect";
            totalTypedRef.current += 1;
          }
          i++;
        }
        // Jump past the space (to start of next word)
        const nextWordStart = i < targetText.length ? i + 1 : i;
        charStatesRef.current = newStates;
        typedCountRef.current = nextWordStart;
        setCharStates([...newStates]);
        setTypedCount(nextWordStart);
        setAccuracy(calcAccuracy(correctCharsRef.current, totalTypedRef.current));
        return;
      }

      const isCorrect = e.key === targetText[idx];
      const newStates = [...charStatesRef.current];
      newStates[idx] = isCorrect ? "correct" : "incorrect";
      charStatesRef.current = newStates;

      if (isCorrect) correctCharsRef.current += 1;
      totalTypedRef.current += 1;

      const newCount = idx + 1;
      typedCountRef.current = newCount;

      setCharStates([...newStates]);
      setTypedCount(newCount);

      const acc = calcAccuracy(correctCharsRef.current, totalTypedRef.current);
      setAccuracy(acc);

      // Check finish
      if (newCount === targetText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (startTimeRef.current) {
          const elapsed = Date.now() - startTimeRef.current;
          setWpm(calcWPM(correctCharsRef.current, elapsed));
        }
        setIsFinished(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [targetText, isStarted, isFinished, reset]);

  return { charStates, typedCount, wpm, accuracy, isStarted, isFinished, reset };
}
