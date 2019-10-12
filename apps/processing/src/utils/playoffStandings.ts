import { Game, TeamRecord } from '@ffstats/models';
import { compareTo } from '../math/math';
import { Standings } from './standings';

export class PlayoffStandings extends Standings {
  public static fromPreviousStandings(prevStandings: Standings): PlayoffStandings {
    const standings = new PlayoffStandings(prevStandings.teamRecords);
    standings.advanceWeek();
    standings.setIsPlayoffs();
    return standings;
  }

  public static fromTeamRecords(teamRecords: TeamRecord[]): PlayoffStandings {
    return new PlayoffStandings(teamRecords);
  }

  public addResult(game: Game) {
    super.addResult(game);

    const gameScore1 = game.gameScores[0];
    const gameScore2 = game.gameScores[1];

    const team1Record = this.getTeamRecord(gameScore1.team_id);
    const team2Record = this.getTeamRecord(gameScore2.team_id);

    const bestRank = Math.min(team1Record.rank, team2Record.rank);
    const worstRank = Math.max(team1Record.rank, team2Record.rank);

    if (gameScore1.points > gameScore2.points) {
      team1Record.rank = bestRank;
      team2Record.rank = worstRank;
    } else {
      team1Record.rank = worstRank;
      team2Record.rank = bestRank;
    }
  }

  public sortStandings() {
    // sort by rank
    this.teamRecords.sort((tr1, tr2) => compareTo(tr1.rank, tr2.rank));
  }

  private setIsPlayoffs() {
    this.teamRecords.forEach(tr => {
      tr.is_playoffs = true;
    });
  }
}
