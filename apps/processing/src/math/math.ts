export function fuzzyCompareEqual(val1: number, val2: number) {
  return Math.abs(val1 - val2) < 1e-7;
}

export function compareTo(val1: number, val2: number) {
  if (fuzzyCompareEqual(val1, val2)) {
    return 0;
  }

  if (val1 < val2) {
    return -1;
  }

  return 1;
}
