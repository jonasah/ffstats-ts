import { Team } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';
import { knex } from './knexInstance';

@Service()
export class TeamRepository extends DbRepository<Team> {
  constructor() {
    super('teams');
  }

  public async getTeamsInYear(year: number): Promise<Team[]> {
    return knex<Team>(this.tableName)
      .join('team_names', {
        'teams.id': 'team_names.team_id'
      })
      .where({ 'team_names.year': year })
      .select('teams.*');
  }
}
