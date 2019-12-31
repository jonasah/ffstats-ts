import { GameScore } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository, IModelEntityConverter } from './dbRepository';

interface GameScoreEntity extends Omit<GameScore, 'teamId' | 'gameId'> {
  id: number;
  team_id: number;
  game_id: number;
}

const converter: IModelEntityConverter<GameScore, GameScoreEntity> = {
  toEntity: gameScore => {
    const { teamId, gameId, ...common } = gameScore;
    return {
      ...common,
      team_id: teamId,
      game_id: gameId
    };
  },
  toModel: entity => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, team_id, game_id, ...common } = entity;
    return {
      ...common,
      teamId: team_id,
      gameId: game_id
    };
  }
};

@Service()
export class GameScoreRepository extends DbRepository<GameScore, GameScoreEntity> {
  constructor() {
    super('game_scores', converter);
  }

  public async updatePoints(
    year: number,
    week: number,
    teamId: number,
    points: number
  ): Promise<void> {
    return this.update({ year, week, teamId }, { points });
  }
}
