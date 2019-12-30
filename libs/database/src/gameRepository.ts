import { Game } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository, IModelEntityConverter } from './dbRepository';
import { GameScoreRepository } from './gameScoreRepository';

type GameEntity = Omit<Game, 'gameScores'>;

const converter: IModelEntityConverter<Game, GameEntity> = {
  toEntity: game => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { gameScores, ...common } = game;
    return { ...common };
  },
  toModel: entity => ({
    ...entity,
    gameScores: []
  })
};

@Service()
export class GameRepository extends DbRepository<Game, GameEntity> {
  constructor(private readonly gameScoreRepository: GameScoreRepository) {
    super('games', converter);
  }

  public async getWeeksInYear(year: number): Promise<number[]> {
    return this.knex
      .distinct('week')
      .where('year', year)
      .then(games => games.map(g => g.week));
  }

  public async insertWithGameScores(games: Omit<Game, 'id'>[]): Promise<void> {
    // TODO: db transaction

    await Promise.all(
      games.map(async game => {
        const gameId = await this.insert({
          year: game.year,
          week: game.week
        });

        await Promise.all(
          game.gameScores.map(async gs => {
            await this.gameScoreRepository.insert({
              year: gs.year,
              week: gs.week,
              teamId: gs.teamId,
              gameId
            });
          })
        );
      })
    );
  }

  public async getByWeek(year: number, week: number): Promise<Game[]> {
    return this.select({ year, week }).then(games =>
      Promise.all(
        games.map(async game => ({
          ...game,
          gameScores: await this.gameScoreRepository.select({ gameId: game.id })
        }))
      )
    );
  }
}
