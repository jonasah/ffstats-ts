export interface ScheduleGame {
  team1: string;
  team2: string;
}

export interface ScheduleWeek {
  week: number;
  games: ScheduleGame[];
}

export interface Schedule {
  year: number;
  numTeams: number;
  numPlayoffTeams: number;
  regularSeasonLength: number;
  playoffLength: number;
  weeks: ScheduleWeek[];
}
