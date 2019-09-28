export interface SeasonInfo {
  id: number;
  year: number;
  num_teams: number;
  num_playoff_teams: number;
  regular_season_length: number;
  playoff_length: number;
  champion_id?: number;
  second_place_id?: number;
  third_place_id?: number;
  sacko_id?: number;
  regular_season_champion_id?: number;
  highest_points_for_team_id?: number;
  highest_points_for: number;
}
