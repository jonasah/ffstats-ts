import { DbContext } from '@ffstats/database';
import { Logger } from '@ffstats/logger';
import { Game } from '@ffstats/models';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import { Service } from 'typedi';
import { Schedule } from '../models/schedule';
import { ICommand } from './command.interface';

@Service()
export class AddScheduleCommand implements ICommand {
  public readonly name = 'add-schedule';

  private files: string[];

  constructor(private readonly dbContext: DbContext, private readonly logger: Logger) {}

  public parseArguments(args: string[]): void {
    const definitions: commandLineArgs.OptionDefinition[] = [
      {
        name: 'file',
        alias: 'f',
        multiple: true,
        defaultOption: true
      }
    ];

    const options = commandLineArgs(definitions, {
      argv: args || []
    });

    this.files = options.file || [];

    if (!this.files || this.files.length === 0) {
      this.logger.warn('No schedule file(s) specified');
    }
  }

  public async run(): Promise<void> {
    for (const file of this.files) {
      await this.addSchedule(file);
    }
  }

  private async addSchedule(scheduleFile: string, force: boolean = false): Promise<void> {
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
        playoff_length: schedule.playoffLength
      });
    }
  }
}
