import { SeasonInfo } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';

@Service()
export class SeasonInfoRepository extends DbRepository<SeasonInfo> {
  constructor() {
    super('season_info');
  }
}
