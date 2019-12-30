import { PlayoffProbability } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository, IModelEntityConverter } from './dbRepository';

interface PlayoffProbabilityEntity
  extends Omit<
    PlayoffProbability,
    'teamId' | 'includingTiebreaker' | 'excludingTiebreaker'
  > {
  team_id: number;
  including_tiebreaker: number;
  excluding_tiebreaker: number;
}

const converter: IModelEntityConverter<PlayoffProbability, PlayoffProbabilityEntity> = {
  toEntity: playoffProb => {
    const { teamId, includingTiebreaker, excludingTiebreaker, ...common } = playoffProb;
    return {
      ...common,
      team_id: teamId,
      including_tiebreaker: includingTiebreaker,
      excluding_tiebreaker: excludingTiebreaker
    };
  },
  toModel: entity => {
    const { team_id, including_tiebreaker, excluding_tiebreaker, ...common } = entity;
    return {
      ...common,
      teamId: team_id,
      includingTiebreaker: including_tiebreaker,
      excludingTiebreaker: excluding_tiebreaker
    };
  }
};

@Service()
export class PlayoffProbabilityRepository extends DbRepository<
  PlayoffProbability,
  PlayoffProbabilityEntity
> {
  constructor() {
    super('playoff_probabilities', converter);
  }
}
