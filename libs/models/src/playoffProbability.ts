export interface PlayoffProbability {
  id: number;
  year: number;
  week: number;
  teamId: number;
  includingTiebreaker: number;
  excludingTiebreaker: number;
}
