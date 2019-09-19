import { Game, Team, TeamRecord } from '@ffstats/models';

import { PlayoffStandings } from './playoff-standings';
import { RegularSeasonStandings } from './regular-season-standings';

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
    const gameScore1 = game.GameScores[0];
    const gameScore2 = game.GameScores[1];
  }

  public abstract sortStandings(): void;

  public getHighestPointsForRecord() {
    return this.teamRecords.reduce(
      (acc, tr) => {
        return acc.PointsFor > tr.PointsFor ? acc : tr;
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
          Year: year,
          Week: 0,
          TeamId: team.Id,
          // create H2H records against eveny other team
          Head2HeadRecords: teams
            .filter(t => t.Id !== team.Id)
            .map(t => ({
              Year: year,
              Week: week,
              TeamId: team.Id,
              OpponentId: t.Id
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
    return this.teamRecords.find(tr => tr.TeamId === teamId);
  }

  protected getHead2HeadRecord(teamRecord: TeamRecord, opponentId: number) {
    return teamRecord.Head2HeadRecords.find(h2h => h2h.OpponentId === opponentId);
  }

  private advanceWeek() {
    this.teamRecords.forEach(teamRecord => {
      teamRecord.Week += 1;

      teamRecord.Head2HeadRecords.forEach(h2hRecord => {
        h2hRecord.Week += 1;
      });
    });
  }

  private setIdsToZero() {
    this.teamRecords.forEach(teamRecord => {
      teamRecord.Id = 0;

      teamRecord.Head2HeadRecords.forEach(h2hRecord => {
        h2hRecord.Id = 0;
      });
    });
  }
}
