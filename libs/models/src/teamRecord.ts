import { Head2HeadRecord } from './head2HeadRecord';

export interface TeamRecord {
  id: number;
  year: number;
  week: number;
  teamId: number;
  rank: number;
  win: number;
  loss: number;
  pointsFor: number;
  pointsAgainst: number;
  isPlayoffs: boolean;

  head2HeadRecords: Head2HeadRecord[];
}
