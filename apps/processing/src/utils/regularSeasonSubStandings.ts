import { compareTo, fuzzyCompareEqual, pct } from '@ffstats/math';
import { TeamRecord, Tiebreaker } from '@ffstats/models';

export class RegularSeasonSubStandings {
  public readonly teamRecords: TeamRecord[] = [];

  constructor(teamRecord: TeamRecord, private readonly tiebreaker: Tiebreaker) {
    this.add(teamRecord);
  }

  public add(teamRecord: TeamRecord) {
    this.teamRecords.push(teamRecord);
  }

  public sortSubStandings() {
    if (this.teamRecords.length === 1) {
      return;
    }

    const teamIds = this.teamRecords.map(tr => tr.teamId);

    // create sub-records
    const subRecords = this.teamRecords.map(tr => {
      const subRecord = {
        teamId: tr.teamId,
        win: 0,
        loss: 0,
        pointsFor: tr.pointsFor
      };

      tr.head2HeadRecords.forEach(h2h => {
        if (teamIds.includes(h2h.opponentId)) {
          subRecord.win += h2h.win;
          subRecord.loss += h2h.loss;
        }
      });

      return subRecord;
    });

    // sort sub-records
    subRecords.sort((sr1, sr2) => {
      if (this.tiebreaker === Tiebreaker.Head2HeadRecords) {
        // first, by percentage
        if (!fuzzyCompareEqual(pct(sr1), pct(sr2))) {
          return compareTo(pct(sr2), pct(sr1));
        }

        // second, by number of wins
        if (sr1.win !== sr2.win) {
          return compareTo(sr2.win, sr1.win);
        }
      }

      // if head-2-head tiebreaker: third, by points for
      // if points for tiebreaker: only sort by points for
      return compareTo(sr2.pointsFor, sr1.pointsFor);
    });

    // sort team records
    this.teamRecords.sort((tr1, tr2) => {
      const p1 = subRecords.findIndex(sr => sr.teamId === tr1.teamId);
      const p2 = subRecords.findIndex(sr => sr.teamId === tr2.teamId);
      return compareTo(p1, p2); // lowest position in subRecords first
    });
  }
}
