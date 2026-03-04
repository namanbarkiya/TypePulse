"use client";

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  isStarted: boolean;
}

export function StatsBar({ wpm, accuracy, isStarted }: StatsBarProps) {
  if (!isStarted) return null;
  return (
    <div className="fixed top-6 right-8 font-mono text-sm text-muted-foreground tabular-nums">
      <span className="text-white font-medium">{wpm}</span> WPM
      {" · "}
      <span className="text-white font-medium">{accuracy}</span>%
    </div>
  );
}
