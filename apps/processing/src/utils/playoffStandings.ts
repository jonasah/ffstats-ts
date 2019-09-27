import { Game, TeamRecord } from '@ffstats/models';

import { compareTo } from '../math/math';
import { Standings } from './standings';

export class PlayoffStandings extends Standings {
  constructor(x: TeamRecord[] | Standings) {
    super(x);
  }

  public addResult(game: Game) {
    super.addResult(game);

    const gameScore1 = game.gameScores[0];
    const gameScore2 = game.gameScores[1];

    const team1Record = this.getTeamRecord(gameScore1.teamId);
    const team2Record = this.getTeamRecord(gameScore2.teamId);

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
}
