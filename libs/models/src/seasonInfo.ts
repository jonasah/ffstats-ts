export interface SeasonInfo {
  id: number;
  numTeams: number;
  numPlayoffTeams: number;
  regularSeasonLength: number;
  playoffLength: number;
  championId?: number;
  secondPlaceId?: number;
  thirdPlaceId?: number;
  sackoId?: number;
  regularSeasonChampionId?: number;
  highestPointsForTeamId?: number;
  highestPointsFor: number;
}
