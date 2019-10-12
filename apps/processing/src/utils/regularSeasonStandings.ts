import { TeamRecord } from '@ffstats/models';
import { compareTo, fuzzyCompareEqual, pct } from '../math/math';
import { RegularSeasonSubStandings, Tiebreaker } from './regularSeasonSubStandings';
import { Standings } from './standings';

export class RegularSeasonStandings extends Standings {
  public static fromPreviousStandings(prevStandings: Standings): RegularSeasonStandings {
    const standings = new RegularSeasonStandings(prevStandings.teamRecords);
    standings.advanceWeek();
    return standings;
  }

  public static fromTeamRecords(teamRecords: TeamRecord[]): RegularSeasonStandings {
    return new RegularSeasonStandings(teamRecords);
  }

  public sortStandings() {
    // sort by percentage first
    this.teamRecords.sort((tr1, tr2) => compareTo(pct(tr2), pct(tr1)));

    // divide into sub-standings where each has the same percentage
    const subStandings = [
      // TODO: tiebreaker type
      new RegularSeasonSubStandings(this.teamRecords[0], Tiebreaker.Head2HeadRecords)
    ];

    for (let i = 1; i < this.teamRecords.length; i += 1) {
      const team1 = this.teamRecords[i - 1];
      const team2 = this.teamRecords[i];

      if (fuzzyCompareEqual(pct(team1), pct(team2))) {
        subStandings[subStandings.length - 1].add(team2);
      } else {
        subStandings.push(
          // TODO: tiebreaker type
          new RegularSeasonSubStandings(team2, Tiebreaker.Head2HeadRecords)
        );
      }
    }

    // sort each sub-standings
    subStandings.forEach(s => s.sortSubStandings());

    // merge sub-standings into final order
    this.teamRecords = [].concat.apply([], subStandings.map(s => s.teamRecords));

    // assign rank
    let rank = 0;
    this.teamRecords.forEach(tr => (tr.rank = rank += 1));
  }
}
