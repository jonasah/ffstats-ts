import { Game, Team, TeamRecord } from '@ffstats/models';

import { PlayoffStandings } from './playoffStandings';
import { RegularSeasonStandings } from './regularSeasonStandings';

export abstract class Standings {
  protected teamRecords: TeamRecord[];

  protected constructor(x: TeamRecord[] | Standings) {
    if (x instanceof Standings) {
      this.teamRecords = x.teamRecords;

      this.advanceWeek();
      this.setIdsToZero();
    } else {
      this.teamRecords = x;
    }
  }

  public isValid() {
    return this.teamRecords.length > 0;
  }

  public addResult(game: Game) {
    const gameScore1 = game.gameScores[0];
    const gameScore2 = game.gameScores[1];
  }

  public abstract sortStandings(): void;

  public getHighestPointsForRecord() {
    return this.teamRecords.reduce(
      (acc, tr) => {
        return acc.pointsFor > tr.pointsFor ? acc : tr;
      },
      {} as TeamRecord
    );
  }

  public getStandings(year: number, week: number) {
    let teamRecords: TeamRecord[];

    if (week === 0) {
      // create default standings
      const teams: Team[] = [];

      teamRecords = [];

      teams.forEach(team => {
        teamRecords.push({
          year,
          week: 0,
          teamId: team.id,
          // create H2H records against eveny other team
          head2HeadRecords: teams
            .filter(t => t.id !== team.id)
            .map(t => ({
              Year: year,
              Week: week,
              TeamId: team.id,
              OpponentId: t.id
            }))
        });
      });
    } else {
      teamRecords = []; // TeamRecordHandler.GetTeamRecordsByWeek(year, week);
    }

    if (week <= SeasonInfoHandler.GetSeason(year).RegularSeasonLength) {
      return new RegularSeasonStandings(teamRecords);
    }

    return new PlayoffStandings(teamRecords);
  }

  protected getTeamRecord(teamId: number) {
    return this.teamRecords.find(tr => tr.teamId === teamId);
  }

  protected getHead2HeadRecord(teamRecord: TeamRecord, opponentId: number) {
    return teamRecord.head2HeadRecords.find(h2h => h2h.opponentId === opponentId);
  }

  private advanceWeek() {
    this.teamRecords.forEach(teamRecord => {
      teamRecord.week += 1;

      teamRecord.head2HeadRecords.forEach(h2hRecord => {
        h2hRecord.week += 1;
      });
    });
  }

  private setIdsToZero() {
    this.teamRecords.forEach(teamRecord => {
      teamRecord.id = 0;

      teamRecord.head2HeadRecords.forEach(h2hRecord => {
        h2hRecord.id = 0;
      });
    });
  }
}
