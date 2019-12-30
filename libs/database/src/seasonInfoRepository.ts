import { SeasonInfo } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository, IModelEntityConverter } from './dbRepository';

interface SeasonInfoEntity extends Pick<SeasonInfo, 'id' | 'year' | 'tiebreaker'> {
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

const converter: IModelEntityConverter<SeasonInfo, SeasonInfoEntity> = {
  toEntity: seasonInfo => ({
    id: seasonInfo.id,
    year: seasonInfo.year,
    num_teams: seasonInfo.numTeams,
    num_playoff_teams: seasonInfo.numPlayoffTeams,
    regular_season_length: seasonInfo.regularSeasonLength,
    playoff_length: seasonInfo.playoffLength,
    champion_id: seasonInfo.championId,
    second_place_id: seasonInfo.secondPlaceId,
    third_place_id: seasonInfo.thirdPlaceId,
    sacko_id: seasonInfo.sackoId,
    regular_season_champion_id: seasonInfo.regularSeasonChampionId,
    highest_points_for_team_id: seasonInfo.highestPointsForTeamId,
    highest_points_for: seasonInfo.highestPointsFor,
    tiebreaker: seasonInfo.tiebreaker
  }),
  toModel: entity => ({
    id: entity.id,
    year: entity.year,
    numTeams: entity.num_teams,
    numPlayoffTeams: entity.num_playoff_teams,
    regularSeasonLength: entity.regular_season_length,
    playoffLength: entity.playoff_length,
    championId: entity.champion_id,
    secondPlaceId: entity.second_place_id,
    thirdPlaceId: entity.third_place_id,
    sackoId: entity.sacko_id,
    regularSeasonChampionId: entity.regular_season_champion_id,
    highestPointsForTeamId: entity.highest_points_for_team_id,
    highestPointsFor: entity.highest_points_for,
    tiebreaker: entity.tiebreaker
  })
};

@Service()
export class SeasonInfoRepository extends DbRepository<SeasonInfo, SeasonInfoEntity> {
  constructor() {
    super('season_info', converter);
  }
}
