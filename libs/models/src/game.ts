import { GameScore } from './game-score';

export interface Game {
  Id?: number;
  Year: number;
  Week: number;

  GameScores: GameScore[];
}
