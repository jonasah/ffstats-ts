import { GameRepository, SeasonInfoRepository, TeamRepository } from '@ffstats/database';
import { Game } from '@ffstats/models';
import fs from 'fs';
import { Schedule } from './models/schedule';

export async function addSchedule(
  scheduleFile: string,
  teamRepository: TeamRepository,
  gameRepository: GameRepository,
  seasonInfoRepository: SeasonInfoRepository,
  force: boolean = false
): Promise<void> {
  const schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf-8')) as Schedule;

  let weeksInDb = await gameRepository.getWeeksInYear(schedule.year);

  if (weeksInDb.length > 0 && force) {
    // TODO: delete games in db
    weeksInDb = [];
  }

  const teams = new Map((await teamRepository.get()).map(team => [team.owner, team]));
  const gamesToAdd: Pick<Game, 'year' | 'week' | 'gameScores'>[] = [];

  schedule.weeks.forEach(week => {
    if (weeksInDb.includes(week.week)) {
      // this week already exists in database
      return;
    }

    week.games.forEach(game => {
      if (!teams.has(game.team1)) {
        throw new Error(`Cannot find team ${game.team1}`);
      }
      if (!teams.has(game.team2)) {
        throw new Error(`Cannot find team ${game.team2}`);
      }

      const team1 = teams.get(game.team1);
      const team2 = teams.get(game.team2);

      gamesToAdd.push({
        year: schedule.year,
        week: week.week,
        gameScores: [
          {
            id: 0, // NOTE: should not be needed
            year: schedule.year,
            week: week.week,
            team_id: team1.id,
            game_id: 0 // NOTE: should not be needed
          },
          {
            id: 0, // NOTE: should not be needed
            year: schedule.year,
            week: week.week,
            team_id: team2.id,
            game_id: 0 // NOTE: should not be needed
          }
        ]
      });
    });
  });

  await gameRepository.createWithGameScores(gamesToAdd);

  if (!(await seasonInfoRepository.get('year', schedule.year, true))) {
    await seasonInfoRepository.create({
      year: schedule.year,
      num_teams: schedule.numTeams,
      num_playoff_teams: schedule.numPlayoffTeams,
      regular_season_length: schedule.regularSeasonLength,
      playoff_length: schedule.playoffLength
    });
  }
}
