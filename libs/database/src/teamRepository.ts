import { Team } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';

@Service()
export class TeamRepository extends DbRepository<Team> {
  constructor() {
    super('teams');
  }
}
