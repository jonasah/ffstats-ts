export interface PlayoffProbability {
  id: number;
  year: number;
  week: number;
  team_id: number;
  including_tiebreaker: number;
  excluding_tiebreaker: number;
}
