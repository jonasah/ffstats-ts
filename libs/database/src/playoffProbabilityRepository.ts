import { PlayoffProbability } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';

@Service()
export class PlayoffProbabilityRepository extends DbRepository<PlayoffProbability> {
  constructor() {
    super('playoff_probabilities');
  }

  public async weekExists(year: number, week: number): Promise<boolean> {
    return this.count({ year, week }).then(count => count > 0);
  }
}
