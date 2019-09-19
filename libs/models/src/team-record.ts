import { Head2HeadRecord } from './head2head-record';

export interface TeamRecord {
  Id: number;
  Year: number;
  Week: number;
  TeamId: number;
  Rank: number;
  Win: number;
  Loss: number;
  PointsFor: number;
  PointsAgainst: number;
  Head2HeadRecords: Head2HeadRecord[];
  IsPlayoffs: boolean;
}
