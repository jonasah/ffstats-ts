import { GameScore } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';

@Service()
export class GameScoreRepository extends DbRepository<GameScore> {
  constructor() {
    super('game_scores');
  }

  public async updatePoints(
    year: number,
    week: number,
    teamId: number,
    points: number
  ): Promise<void> {
    return this.update({ year, week, team_id: teamId }, { points });
  }
}
