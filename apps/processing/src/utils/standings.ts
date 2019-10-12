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

    const team1Record = this.getTeamRecord(gameScore1.team_id);
    team1Record.points_for += gameScore1.points;
    team1Record.points_against += gameScore2.points;

    const team2Record = this.getTeamRecord(gameScore2.team_id);
    team2Record.points_for += gameScore2.points;
    team2Record.points_against += gameScore1.points;

    const team1VsTeam2Record = this.getHead2HeadRecord(team1Record, team2Record.team_id);
    const team2VsTeam1Record = this.getHead2HeadRecord(team2Record, team1Record.team_id);

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
    return this.teamRecords.reduce(
      (acc, tr) => {
        return acc.points_for > tr.points_for ? acc : tr;
      },
      {} as TeamRecord
    );
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
    return this.teamRecords.find(tr => tr.team_id === teamId);
  }

  protected getHead2HeadRecord(
    teamRecord: TeamRecord,
    opponentId: number
  ): Head2HeadRecord {
    return teamRecord.head2HeadRecords.find(h2h => h2h.opponent_id === opponentId);
  }
}
