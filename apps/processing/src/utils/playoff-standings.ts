import { Game, TeamRecord } from '@ffstats/models';

import { compareTo } from '../math/math';
import { Standings } from './standings';

export class PlayoffStandings extends Standings {
  constructor(x: TeamRecord[] | Standings) {
    super(x);
  }

  public addResult(game: Game) {
    super.addResult(game);

    const gameScore1 = game.GameScores[0];
    const gameScore2 = game.GameScores[1];

    const team1Record = this.getTeamRecord(gameScore1.TeamId);
    const team2Record = this.getTeamRecord(gameScore2.TeamId);

    const bestRank = Math.min(team1Record.Rank, team2Record.Rank);
    const worstRank = Math.max(team1Record.Rank, team2Record.Rank);

    if (gameScore1.Points > gameScore2.Points) {
      team1Record.Rank = bestRank;
      team2Record.Rank = worstRank;
    } else {
      team1Record.Rank = worstRank;
      team2Record.Rank = bestRank;
    }
  }

  public sortStandings() {
    // sort by rank
    this.teamRecords.sort((tr1, tr2) => compareTo(tr1.Rank, tr2.Rank));
  }
}
