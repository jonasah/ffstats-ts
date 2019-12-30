import { Game, Head2HeadRecord, TeamRecord, Tiebreaker } from '@ffstats/models';

export abstract class Standings {
  protected constructor(
    public teamRecords: TeamRecord[],
    public readonly tiebreaker: Tiebreaker
  ) {}

  public isValid(): boolean {
    return this.teamRecords.length > 0;
  }

  public addResult(game: Game): void {
    const gameScore1 = game.gameScores[0];
    const gameScore2 = game.gameScores[1];

    const team1Record = this.getTeamRecord(gameScore1.teamId);
    team1Record.pointsFor += gameScore1.points;
    team1Record.pointsAgainst += gameScore2.points;

    const team2Record = this.getTeamRecord(gameScore2.teamId);
    team2Record.pointsFor += gameScore2.points;
    team2Record.pointsAgainst += gameScore1.points;

    const team1VsTeam2Record = this.getHead2HeadRecord(team1Record, team2Record.teamId);
    const team2VsTeam1Record = this.getHead2HeadRecord(team2Record, team1Record.teamId);

    if (gameScore1.points > gameScore2.points) {
      team1Record.win += 1;
      team2Record.loss += 1;

      team1VsTeam2Record.win += 1;
      team2VsTeam1Record.loss += 1;
    } else {
      team1Record.loss += 1;
      team2Record.win += 1;

      team1VsTeam2Record.loss += 1;
      team2VsTeam1Record.win += 1;
    }
  }

  public abstract sortStandings(): void;

  public getHighestPointsForRecord(): TeamRecord {
    return this.teamRecords.reduce((acc, tr) => {
      return acc.pointsFor > tr.pointsFor ? acc : tr;
    }, {} as TeamRecord);
  }

  protected advanceWeek(): void {
    this.teamRecords.forEach(teamRecord => {
      teamRecord.week += 1;

      teamRecord.head2HeadRecords.forEach(h2hRecord => {
        h2hRecord.week += 1;
      });
    });
  }

  protected getTeamRecord(teamId: number): TeamRecord {
    return this.teamRecords.find(tr => tr.teamId === teamId);
  }

  protected getHead2HeadRecord(
    teamRecord: TeamRecord,
    opponentId: number
  ): Head2HeadRecord {
    return teamRecord.head2HeadRecords.find(h2h => h2h.opponentId === opponentId);
  }
}
