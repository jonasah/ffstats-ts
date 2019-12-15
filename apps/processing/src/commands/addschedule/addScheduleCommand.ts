import { DbContext } from '@ffstats/database';
import { Game, Tiebreaker } from '@ffstats/models';
import fs from 'fs';
import { Service } from 'typedi';
import { Arguments, Argv } from 'yargs';
import { Schedule } from '../../models/schedule';
import { ICommand } from '../command.interface';

interface AddScheduleCommandOptions {
  file: string[];
}

@Service()
export class AddScheduleCommand implements ICommand<AddScheduleCommandOptions> {
  public readonly name = 'add-schedule';

  constructor(private readonly dbContext: DbContext) {}

  public configure(argv: Argv): Argv {
    return argv.command(`${this.name} <file...>`, 'Add schedule', yargs =>
      yargs.positional('file', {
        type: 'string'
      })
    );
  }

  public async run(args: Arguments<AddScheduleCommandOptions>): Promise<void> {
    for (const file of args.file) {
      await this.addSchedule(file);
    }
  }

  private async addSchedule(scheduleFile: string, force = false): Promise<void> {
    const schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf-8')) as Schedule;

    let weeksInDb = await this.dbContext.games.getWeeksInYear(schedule.year);

    if (weeksInDb.length > 0 && force) {
      // TODO: delete games in db
      weeksInDb = [];
    }

    const teams = new Map(
      (await this.dbContext.teams.select()).map(team => [team.owner, team])
    );
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

    await this.dbContext.games.insertWithGameScores(gamesToAdd);

    if (!(await this.dbContext.seasonInfo.select({ year: schedule.year }, true))) {
      await this.dbContext.seasonInfo.insert({
        year: schedule.year,
        num_teams: schedule.numTeams,
        num_playoff_teams: schedule.numPlayoffTeams,
        regular_season_length: schedule.regularSeasonLength,
        playoff_length: schedule.playoffLength,
        tiebreaker: Tiebreaker[schedule.tiebreaker]
      });
    }
  }
}
