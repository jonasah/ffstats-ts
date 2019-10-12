import { GameScore } from './gameScore';

export interface Game {
  id: number;
  year: number;
  week: number;

  gameScores: GameScore[];
}

export const hasValidResult = (game: Game) => game.gameScores.every(gs => gs.points);
