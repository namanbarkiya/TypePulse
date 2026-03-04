"use client";

import { CharState } from "@/lib/typing";

interface CharDisplayProps {
  char: string;
  state: CharState;
  isCursor: boolean;
  isTypingActive?: boolean;
}

export function CharDisplay({ char, state, isCursor, isTypingActive }: CharDisplayProps) {
  const colorClass =
    state === "correct"
      ? "text-white"
      : state === "incorrect"
        ? "text-red-400"
        : "text-gray-500";

  return (
    <span
      className={`relative ${colorClass}`}
      data-cursor={isCursor ? "true" : undefined}
      style={{ transition: "color 60ms ease, opacity 60ms ease" }}
    >
      {isCursor && (
        <span
          className="absolute -left-px top-[0.1em] bottom-[0.1em] w-0.5 bg-yellow-400 rounded-full"
          style={{
            animation: isTypingActive ? "none" : "blink 1s step-end infinite",
          }}
        />
      )}
      {char === " " ? "\u00A0" : char}
    </span>
  );
}
