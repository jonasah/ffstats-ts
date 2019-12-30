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
}
