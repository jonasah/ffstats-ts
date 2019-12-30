import { Position, RosterEntry } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository, IModelEntityConverter } from './dbRepository';

interface RosterEntryEntity
  extends Omit<RosterEntry, 'teamId' | 'playerId' | 'isByeWeek' | 'Player'> {
  team_id: number;
  player_id: number;
  is_bye_week: boolean;
}

const converter: IModelEntityConverter<RosterEntry, RosterEntryEntity> = {
  toEntity: rosterEntry => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { teamId, playerId, isByeWeek, Player, ...common } = rosterEntry;
    return {
      ...common,
      team_id: teamId,
      player_id: playerId,
      is_bye_week: isByeWeek
    };
  },
  toModel: entity => {
    const { team_id, player_id, is_bye_week, ...common } = entity;
    return {
      ...common,
      teamId: team_id,
      playerId: player_id,
      isByeWeek: is_bye_week
    };
  }
};

@Service()
export class RosterRepository extends DbRepository<RosterEntry, RosterEntryEntity> {
  constructor() {
    super('rosters', converter);
  }

  public async getTotalPointsPerTeam(
    year: number,
    week: number
  ): Promise<{ teamId: number; points: number }[]> {
    return this.knex
      .where({ year, week })
      .andWhere('position', '<=', Position.FLX)
      .groupBy('team_id')
      .select('team_id as teamId')
      .sum('points as points');
  }
}
