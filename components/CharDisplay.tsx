"use client";

import { CharState } from "@/lib/typing";

interface CharDisplayProps {
  char: string;
  state: CharState;
  isCursor: boolean;
}

export function CharDisplay({ char, state, isCursor }: CharDisplayProps) {
  const colorClass =
    state === "correct"
      ? "text-white"
      : state === "incorrect"
        ? "text-red-400 bg-red-900/20"
        : "text-gray-600";

  return (
    <span className={`relative ${colorClass}`}>
      {isCursor && (
        <span
          className="absolute -left-px top-0 h-full w-0.5 bg-yellow-400"
          style={{ animation: "blink 1s step-end infinite" }}
        />
      )}
      {char === " " ? "\u00A0" : char}
    </span>
  );
}
