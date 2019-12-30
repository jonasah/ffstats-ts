import { Tiebreaker } from './enums/tiebreaker';

export interface SeasonInfo {
  id: number;
  year: number;
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
  tiebreaker: Tiebreaker;
}

export const seasonLength = (seasonInfo: SeasonInfo) =>
  seasonInfo.regularSeasonLength + seasonInfo.playoffLength;
