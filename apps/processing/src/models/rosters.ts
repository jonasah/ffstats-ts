import { Position } from '@ffstats/models';

export interface RosterEntry {
  playerName: string;
  playerPosition: keyof typeof Position; // NOTE: can we serialize to Position?
  rosterPosition: keyof typeof Position; // NOTE: can we serialize to Position?
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
