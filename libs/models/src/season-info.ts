export interface SeasonInfo {
  Id: number;
  NumTeams: number;
  NumPlayoffTeams: number;
  RegularSeasonLength: number;
  PlayoffLength: number;
  ChampionId?: number;
  SecondPlaceId?: number;
  ThirdPlaceId?: number;
  SackoId?: number;
  RegularSeasonChampionId?: number;
  HighestPointsForTeamId?: number;
  HighestPointsFor: number;
}
