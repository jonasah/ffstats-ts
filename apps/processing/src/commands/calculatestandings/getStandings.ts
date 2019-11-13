import { DbContext } from '@ffstats/database';
import { TeamRecord } from '@ffstats/models';
import { PlayoffStandings } from '../../utils/playoffStandings';
import { RegularSeasonStandings } from '../../utils/regularSeasonStandings';
import { Standings } from '../../utils/standings';

export async function getStandings(
  year: number,
  week: number,
  dbContext: DbContext
): Promise<Standings> {
  let teamRecords: TeamRecord[];

  if (week === 0) {
    // create default standings
    const teams = await dbContext.teams.getTeamsInYear(year);

    teamRecords = [];

    teams.forEach(team => {
      teamRecords.push({
        id: 0,
        year,
        week: 0,
        team_id: team.id,
        rank: 0,
        win: 0,
        loss: 0,
        points_for: 0,
        points_against: 0,
        is_playoffs: false,
        // create H2H records against every other team
        head2HeadRecords: teams
          .filter(t => t.id !== team.id)
          .map(t => ({
            id: 0, // NOTE: should not be needed
            year,
            week,
            team_id: team.id,
            opponent_id: t.id,
            win: 0,
            loss: 0,
            team_record_id: 0 // NOTE: should not be needed
          }))
      });
    });
  } else {
    teamRecords = await dbContext.teamRecords.getTeamRecordsByWeek(year, week);
  }

  const seasonInfo = await dbContext.seasonInfo.select({ year }, true);

  if (week <= seasonInfo.regular_season_length) {
    return RegularSeasonStandings.fromTeamRecords(teamRecords, seasonInfo.tiebreaker);
  }

  return PlayoffStandings.fromTeamRecords(teamRecords, seasonInfo.tiebreaker);
}
