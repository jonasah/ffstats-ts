import { TeamRecord } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';
import { Head2HeadRecordRepository } from './head2headRecordRepository';
import { knex } from './knexInstance';

@Service()
export class TeamRecordRepository extends DbRepository<TeamRecord> {
  constructor(private readonly head2HeadRecordRepository: Head2HeadRecordRepository) {
    super('team_records');
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
              team_record_id: teamRecordId
            });
          })
        );
      })
    );
  }

  public async weekExists(year: number, week: number): Promise<boolean> {
    return this.count({ year, week }).then(count => count > 0);
  }

  public async getTeamRecordsByWeek(year: number, week: number): Promise<TeamRecord[]> {
    return knex<TeamRecord>(this.tableName)
      .where({ year, week })
      .orderBy('rank')
      .then(teamRecords =>
        Promise.all(
          teamRecords.map(async tr => ({
            ...tr,
            head2HeadRecords: await this.head2HeadRecordRepository.select({
              team_record_id: tr.id
            })
          }))
        )
      );
  }
}
