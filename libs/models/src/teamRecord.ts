import { Head2HeadRecord } from './head2HeadRecord';

export interface TeamRecord {
  id: number;
  year: number;
  week: number;
  team_id: number;
  rank: number;
  win: number;
  loss: number;
  points_for: number;
  points_against: number;
  is_playoffs: boolean;

  head2HeadRecords: Head2HeadRecord[];
}
