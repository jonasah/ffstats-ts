import { Tiebreaker } from '@ffstats/models';

export interface SeasonTeam {
  owner: string;
  name: string;
}

export interface ScheduleGame {
  team1: string;
  team2: string;
}

export interface ScheduleWeek {
  week: number;
  games: ScheduleGame[];
}

export type Schedule = ScheduleWeek[];

export interface Season {
  year: number;
  numTeams: number;
  numPlayoffTeams: number;
  regularSeasonLength: number;
  playoffLength: number;
  tiebreaker: keyof typeof Tiebreaker; // NOTE: can we serialize to Tiebreaker?
  teams: SeasonTeam[];
  schedule: Schedule;
}
