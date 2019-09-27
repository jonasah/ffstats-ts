import { TeamRecord } from '@ffstats/models';

import { fuzzyCompareEqual } from '../math/math';
import { RegularSeasonSubStandings } from './regularSeasonSubStandings';
import { Standings } from './standings';

export class RegularSeasonStandings extends Standings {
  constructor(x: TeamRecord[] | Standings) {
    super(x);
  }

  public sortStandings() {
    // sort by percentage first

    // divide into sub-standings where each has the same percentage
    const subStandings = [new RegularSeasonSubStandings(this.teamRecords[0])];

    for (let i = 1; i < this.teamRecords.length; i += 1) {
      const team1 = this.teamRecords[i - 1];
      const team2 = this.teamRecords[i];

      if (fuzzyCompareEqual(team1.pct, team2.pct)) {
        subStandings[subStandings.length - 1].add(team2);
      } else {
        subStandings.push(new RegularSeasonSubStandings(team2));
      }
    }

    // sort each sub-standings
    subStandings.forEach(s => s.sortSubStandings());

    // merge sub-standings into final order
    this.teamRecords = [].concat.apply([], subStandings.map(s => s.teamRecords));

    // assign rank
    let rank = 1;
    this.teamRecords.forEach(tr => (tr.Rank = rank += 1));
  }
}
