import { TeamRecord, Tiebreaker } from '@ffstats/models';
import { compareTo, fuzzyCompareEqual, pct } from '../math/math';
import { RegularSeasonSubStandings } from './regularSeasonSubStandings';
import { Standings } from './standings';

export class RegularSeasonStandings extends Standings {
  public static fromPreviousStandings(prevStandings: Standings): RegularSeasonStandings {
    const standings = new RegularSeasonStandings(
      prevStandings.teamRecords,
      prevStandings.tiebreaker
    );
    standings.advanceWeek();
    return standings;
  }

  public static fromTeamRecords(
    teamRecords: TeamRecord[],
    tiebreaker: Tiebreaker
  ): RegularSeasonStandings {
    return new RegularSeasonStandings(teamRecords, tiebreaker);
  }

  public sortStandings() {
    // sort by percentage first
    this.teamRecords.sort((tr1, tr2) => compareTo(pct(tr2), pct(tr1)));

    // divide into sub-standings where each has the same percentage
    const subStandings = [
      new RegularSeasonSubStandings(this.teamRecords[0], this.tiebreaker)
    ];

    for (let i = 1; i < this.teamRecords.length; i += 1) {
      const team1 = this.teamRecords[i - 1];
      const team2 = this.teamRecords[i];

      if (fuzzyCompareEqual(pct(team1), pct(team2))) {
        subStandings[subStandings.length - 1].add(team2);
      } else {
        subStandings.push(new RegularSeasonSubStandings(team2, this.tiebreaker));
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
