import { TeamName } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository, IModelEntityConverter } from './dbRepository';

interface TeamNameEntity extends Omit<TeamName, 'teamId'> {
  team_id: number;
}

const converter: IModelEntityConverter<TeamName, TeamNameEntity> = {
  toEntity: teamName => {
    const { teamId, ...common } = teamName;
    return {
      ...common,
      team_id: teamId
    };
  },
  toModel: teamNameEntity => {
    const { team_id, ...common } = teamNameEntity;
    return {
      ...common,
      teamId: team_id
    };
  }
};

@Service()
export class TeamNameRepository extends DbRepository<TeamName, TeamNameEntity> {
  constructor() {
    super('team_names', converter);
  }

  public async getWithOwnersInYear(year: number): Promise<Map<string, string>> {
    return this.knex
      .join('teams', {
        'team_names.team_id': 'teams.id'
      })
      .where({ 'team_names.year': year })
      .select(['team_names.name', 'teams.owner'])
      .then(teams => new Map(teams.map(t => [t.name, t.owner])));
  }
}
