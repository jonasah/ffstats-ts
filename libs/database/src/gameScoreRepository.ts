import { GameScore } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';

@Service()
export class GameScoreRepository extends DbRepository<GameScore> {
  constructor() {
    super('game_scores');
  }
}
