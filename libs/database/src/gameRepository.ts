import { Game } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';
import { GameScoreRepository } from './gameScoreRepository';
import { knex } from './knexInstance';

@Service()
export class GameRepository extends DbRepository<Game> {
  constructor(private readonly gameScoreRepository: GameScoreRepository) {
    super('games');
  }

  public async getWeeksInYear(year: number): Promise<number[]> {
    return (await knex<Game>(this.tableName)
      .distinct('week')
      .where('year', year)).map(g => g.week);
  }

  public async createWithGameScores(
    games: Pick<Game, 'year' | 'week' | 'gameScores'>[]
  ): Promise<void> {
    // TODO: db transaction

    await Promise.all(
      games.map(async game => {
        const gameId = await this.create({
          year: game.year,
          week: game.week
        });

        await Promise.all(
          game.gameScores.map(async gs => {
            await this.gameScoreRepository.create({
              year: gs.year,
              week: gs.week,
              team_id: gs.team_id,
              game_id: gameId
            });
          })
        );
      })
    );
  }
}