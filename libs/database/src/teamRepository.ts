import { Team } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository, IModelEntityConverter } from './dbRepository';

type TeamEntity = Team;

const converter: IModelEntityConverter<Team, TeamEntity> = {
  toEntity: team => ({ ...team }),
  toModel: teamEntity => ({ ...teamEntity })
};

@Service()
export class TeamRepository extends DbRepository<Team, TeamEntity> {
  constructor() {
    super('teams', converter);
  }

  public async getTeamsInYear(year: number): Promise<Team[]> {
    return this.knex
      .join('team_names', {
        'teams.id': 'team_names.team_id'
      })
      .where({ 'team_names.year': year })
      .select('teams.*');
  }
}
