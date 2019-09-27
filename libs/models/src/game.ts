import { GameScore } from './gameScore';

export interface Game {
  Id?: number;
  Year: number;
  Week: number;

  GameScores: GameScore[];
}
