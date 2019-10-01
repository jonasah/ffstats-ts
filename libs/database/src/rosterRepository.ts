import { Position, RosterEntry } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';
import { knex } from './knexInstance';

@Service()
export class RosterRepository extends DbRepository<RosterEntry> {
  constructor() {
    super('rosters');
  }

  public async weekExists(year: number, week: number): Promise<boolean> {
    // TODO: use exists query
    return this.get({ year, week }).then(entries => entries.length > 0);
  }

  public async getTotalPointsPerTeam(
    year: number,
    week: number
  ): Promise<{ teamId: number; points: number }[]> {
    return knex<RosterEntry>(this.tableName)
      .where({ year, week })
      .andWhere('position', '<=', Position.FLX)
      .groupBy('team_id')
      .select('team_id as teamId')
      .sum('points as points');
  }
}
