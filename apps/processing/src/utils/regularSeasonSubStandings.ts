import { TeamRecord } from '@ffstats/models';

import { compareTo, fuzzyCompareEqual } from '../math/math';

interface SubRecord {
  teamId: number;
  win: number;
  loss: number;
  pointsFor: number;
}

export class RegularSeasonSubStandings {
  public readonly teamRecords: TeamRecord[] = [];

  constructor(teamRecord: TeamRecord) {
    this.add(teamRecord);
  }

  public add(teamRecord: TeamRecord) {
    this.teamRecords.push(teamRecord);
  }

  public sortSubStandings() {
    if (this.teamRecords.length === 1) {
      return;
    }

    const teamIds = this.teamRecords.map(tr => tr.TeamId);

    // create sub-records
    const subRecords = this.teamRecords.map(tr => {
      const subRecord: SubRecord = {
        teamId: tr.TeamId,
        pointsFor: tr.PointsFor
      };

      tr.Head2HeadRecords.forEach(h2h => {
        if (teamIds.includes(h2h.OpponentId)) {
          subRecord.win += h2h.Win;
          subRecord.loss += h2h.Loss;
        }
      });

      return subRecord;
    });

    // sort sub-records
    subRecords.sort((sr1, sr2) => {
      // first, by percentage
      if (!fuzzyCompareEqual(sr1.Pct, sr2.Pct)) {
        return compareTo(sr2.pct, sr1.pct);
      }

      // second, by number of wins
      if (sr1.win !== sr2.win) {
        return compareTo(sr2.win, sr1.win);
      }

      // third, by points for
      return compareTo(sr2.pointsFor, sr1.pointsFor);
    });

    // sort team records
    this.teamRecords.sort((tr1, tr2) => {
      const p1 = subRecords.findIndex(sr => sr.teamId === tr1.TeamId);
      const p2 = subRecords.findIndex(sr => sr.teamId === tr2.TeamId);
      return compareTo(p1, p2); // lowest position in subRecords first
    });
  }
}
