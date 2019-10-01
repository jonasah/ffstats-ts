import { Player } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';

@Service()
export class PlayerRepository extends DbRepository<Player> {
  constructor() {
    super('players');
  }
}
