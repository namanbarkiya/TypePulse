export type CharState = "pending" | "correct" | "incorrect";

/**
 * Standard WPM formula: (correctChars / 5) / (elapsedMs / 60000)
 * 5 chars = 1 "word" by convention.
 */
export function calcWPM(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || correctChars <= 0) return 0;
  return Math.round((correctChars / 5) / (elapsedMs / 60000));
}

/**
 * Accuracy as a percentage (0–100), rounded to nearest integer.
 */
export function calcAccuracy(correct: number, total: number): number {
  if (total <= 0) return 100;
  return Math.round((correct / total) * 100);
}
