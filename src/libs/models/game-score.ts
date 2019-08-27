export interface GameScore {
  id: number;
  year: number;
  week: number;
  teamId: number;
  points: number | undefined;
  gameId: number;
}
