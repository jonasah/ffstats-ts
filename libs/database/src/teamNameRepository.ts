import { TeamName } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';

@Service()
export class TeamNameRepository extends DbRepository<TeamName> {
  constructor() {
    super('team_names');
  }
}
