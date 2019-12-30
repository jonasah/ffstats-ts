import { Player } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository, IModelEntityConverter } from './dbRepository';

type PlayerEntity = Player;

const converter: IModelEntityConverter<Player, PlayerEntity> = {
  toEntity: player => ({ ...player }),
  toModel: entity => ({ ...entity })
};

@Service()
export class PlayerRepository extends DbRepository<Player, PlayerEntity> {
  constructor() {
    super('players', converter);
  }
}
