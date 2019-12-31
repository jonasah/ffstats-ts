import { Head2HeadRecord } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository, IModelEntityConverter } from './dbRepository';

interface Head2HeadRecordEntity
  extends Omit<Head2HeadRecord, 'teamId' | 'opponentId' | 'teamRecordId'> {
  id: number;
  team_id: number;
  opponent_id: number;
  team_record_id: number;
}

const converter: IModelEntityConverter<Head2HeadRecord, Head2HeadRecordEntity> = {
  toEntity: head2HeadRecords => {
    const { teamId, opponentId, teamRecordId, ...common } = head2HeadRecords;
    return {
      ...common,
      team_id: teamId,
      opponent_id: opponentId,
      team_record_id: teamRecordId
    };
  },
  toModel: entity => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, team_id, opponent_id, team_record_id, ...common } = entity;
    return {
      ...common,
      teamId: team_id,
      opponentId: opponent_id,
      teamRecordId: team_record_id
    };
  }
};

@Service()
export class Head2HeadRecordRepository extends DbRepository<
  Head2HeadRecord,
  Head2HeadRecordEntity
> {
  constructor() {
    super('head2head_records', converter);
  }
}
