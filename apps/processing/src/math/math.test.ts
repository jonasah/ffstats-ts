import { compareTo, fuzzyCompareEqual, pct } from './math';

describe('math', () => {
  test.each([
    [0, 1, false],
    [1, 0, false],
    [1, 1, true],
    [0, -1, false],
    [-1, 0, false],
    [-1, -1, true]
  ])('fuzzyCompareEqual(%i, %i)', (val1: number, val2: number, expected: boolean) => {
    expect(fuzzyCompareEqual(val1, val2)).toBe(expected);
  });

  test.each([[0, 1, -1], [1, 1, 0], [1, 0, 1], [0, -1, 1], [-1, -1, 0], [-1, 0, -1]])(
    'compareTo(%i, %i)',
    (val1, val2, expected) => {
      expect(compareTo(val1, val2)).toBe(expected);
    }
  );

  test.each([[4, 4, 0.5], [0, 0, 0], [2, 4, 0.333], [4, 0, 1]])(
    'pct(%i, %i)',
    (win, loss, expected) => {
      expect(pct({ win, loss })).toBeCloseTo(expected);
    }
  );
});
