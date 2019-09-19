export interface PlayoffProbability {
  team: string;
  excludingTiebreakers: boolean;
  includingTiebreakers: boolean;
}

export interface PlayoffProbabilities {
  year: number;
  week: number;
  probability: PlayoffProbability[];
}
