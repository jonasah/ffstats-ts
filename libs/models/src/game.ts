import { GameScore } from './gameScore';

export interface Game {
  id: number;
  year: number;
  week: number;

  gameScores: GameScore[];
}
