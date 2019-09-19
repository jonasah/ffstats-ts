import { Game, Team } from '@ffstats/models';
import fs from 'fs';

import { Schedule } from './models/schedule';

export function addSchedule(scheduleFile: string, force: boolean = false) {
  if (scheduleFile == null) {
    return;
  }

  const schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf-8')) as Schedule;

  let weeksInDb: number[] = [];

  if (weeksInDb.length > 0 && force) {
    // TODO: delete games
    weeksInDb = [];
  }

  const teams = {};
  const gamesToAdd: Game[] = [];

  schedule.weeks.forEach(week => {
    if (weeksInDb.includes(week.week)) {
      // this week already exists in database
      return;
    }

    week.games.forEach(game => {
      if (!teams[game.team1]) {
        const team: Team = {
          Name: game.team1,
          Owner: ''
        };

        teams[game.team1] = team;
      }
      if (!teams[game.team2]) {
        const team: Team = {
          Name: game.team2,
          Owner: ''
        };

        teams[game.team2] = team;
      }

      const team1 = teams[game.team1];
      const team2 = teams[game.team2];

      gamesToAdd.push({
        Year: schedule.year,
        Week: week.week
        // TODO: game scores
      });
    });
  });

  // TODO: GamesHandler.Add

  // TODO: add season if not exists
}
