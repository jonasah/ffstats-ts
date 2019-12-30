import { TeamRecord } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository, IModelEntityConverter } from './dbRepository';
import { Head2HeadRecordRepository } from './head2headRecordRepository';

interface TeamRecordEntity
  extends Omit<
    TeamRecord,
    'teamId' | 'pointsFor' | 'pointsAgainst' | 'isPlayoffs' | 'head2HeadRecords'
  > {
  team_id: number;
  points_for: number;
  points_against: number;
  is_playoffs: boolean;
}

const converter: IModelEntityConverter<TeamRecord, TeamRecordEntity> = {
  toEntity: teamRecord => {
    const {
      teamId,
      pointsFor,
      pointsAgainst,
      isPlayoffs,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      head2HeadRecords,
      ...common
    } = teamRecord;
    return {
      ...common,
      team_id: teamId,
      points_for: pointsFor,
      points_against: pointsAgainst,
      is_playoffs: isPlayoffs
    };
  },
  toModel: entity => {
    const { team_id, points_for, points_against, is_playoffs, ...common } = entity;
    return {
      ...common,
      teamId: team_id,
      pointsFor: points_for,
      pointsAgainst: points_against,
      isPlayoffs: is_playoffs,
      head2HeadRecords: []
    };
  }
};

@Service()
export class TeamRecordRepository extends DbRepository<TeamRecord, TeamRecordEntity> {
  constructor(private readonly head2HeadRecordRepository: Head2HeadRecordRepository) {
    super('team_records', converter);
  }

  public async insertWithHead2HeadRecords(teamRecords: TeamRecord[]): Promise<void> {
    await Promise.all(
      teamRecords.map(async teamRecord => {
        const { head2HeadRecords, ...tr } = teamRecord;
        const teamRecordId = await this.insert(tr);

        await Promise.all(
          head2HeadRecords.map(async h2h => {
            await this.head2HeadRecordRepository.insert({
              ...h2h,
              teamRecordId
            });
          })
        );
      })
    );
  }

  public async getTeamRecordsByWeek(year: number, week: number): Promise<TeamRecord[]> {
    return this.select({ year, week })
      .then(teamRecords => {
        teamRecords.sort((tr1, tr2) => (tr1.rank < tr2.rank ? -1 : 1));
        return teamRecords;
      })
      .then(teamRecords =>
        Promise.all(
          teamRecords.map(async tr => ({
            ...tr,
            head2HeadRecords: await this.head2HeadRecordRepository.select({
              teamRecordId: tr.id
            })
          }))
        )
      );
  }
}
