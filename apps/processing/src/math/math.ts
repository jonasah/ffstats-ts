export function fuzzyCompareEqual(val1: number, val2: number): boolean {
  return Math.abs(val1 - val2) < 1e-7;
}

export function compareTo(val1: number, val2: number): number {
  if (fuzzyCompareEqual(val1, val2)) {
    return 0;
  }

  return val1 < val2 ? -1 : 1;
}

export function pct(record: { win: number; loss: number }): number {
  const gamesPlayed = record.win + record.loss;
  return gamesPlayed === 0 ? 0 : record.win / gamesPlayed;
}
