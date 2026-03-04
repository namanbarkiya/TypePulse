"use client";

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  isStarted: boolean;
}

export function StatsBar({ wpm, accuracy, isStarted }: StatsBarProps) {
  if (!isStarted) return null;
  return (
    <div
      className="fixed top-6 right-8 font-mono text-sm text-muted-foreground tabular-nums"
      style={{ transition: "opacity 0.3s ease" }}
    >
      <span className="text-white font-medium" style={{ transition: "color 0.15s ease" }}>{wpm}</span> WPM
      {" · "}
      <span className="text-white font-medium" style={{ transition: "color 0.15s ease" }}>{accuracy}</span>%
    </div>
  );
}
