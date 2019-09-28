export interface SeasonTeam {
  owner: string;
  name: string;
}

export interface SeasonTeams {
  year: number;
  teams: SeasonTeam[];
}
