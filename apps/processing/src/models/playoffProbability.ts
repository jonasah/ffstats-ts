export interface PlayoffProbability {
  team: string;
  excludingTiebreakers: number;
  includingTiebreakers: number;
}

export interface PlayoffProbabilities {
  year: number;
  week: number;
  probability: PlayoffProbability[];
}
