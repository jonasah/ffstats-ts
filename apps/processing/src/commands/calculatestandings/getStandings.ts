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
        teamId: team.id,
        rank: 0,
        win: 0,
        loss: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        isPlayoffs: false,
        // create H2H records against every other team
        head2HeadRecords: teams
          .filter(t => t.id !== team.id)
          .map(t => ({
            id: 0, // NOTE: should not be needed
            year,
            week,
            teamId: team.id,
            opponentId: t.id,
            win: 0,
            loss: 0,
            teamRecordId: 0 // NOTE: should not be needed
          }))
      });
    });
  } else {
    teamRecords = await dbContext.teamRecords.getTeamRecordsByWeek(year, week);
  }

  const seasonInfo = await dbContext.seasonInfo.select({ year }, true);

  if (week <= seasonInfo.regularSeasonLength) {
    return RegularSeasonStandings.fromTeamRecords(teamRecords, seasonInfo.tiebreaker);
  }

  return PlayoffStandings.fromTeamRecords(teamRecords, seasonInfo.tiebreaker);
}
