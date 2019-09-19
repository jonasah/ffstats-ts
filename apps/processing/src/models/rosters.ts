import { Position } from '@ffstats/models';

export interface RosterEntry {
  playerName: string;
  playerPosition: Position;
  rosterPosition: Position;
  points?: number;
  isByeWeek: boolean;
}

export interface Roster {
  team: string;
  entries: RosterEntry[];
}

export interface WeekRosters {
  year: number;
  week: number;
  rosters: Roster[];
}
