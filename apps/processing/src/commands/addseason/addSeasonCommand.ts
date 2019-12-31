import { DbContext } from '@ffstats/database';
import { Logger } from '@ffstats/logger';
import { Game, Tiebreaker, SeasonInfo } from '@ffstats/models';
import fs from 'fs';
import { Service } from 'typedi';
import { Arguments, Argv } from 'yargs';
import { Schedule, Season, SeasonTeam } from '../../models/season';
import { ICommand } from '../command.interface';

interface AddSeasonCommandOptions {
  file: string[];
}

@Service()
export class AddSeasonCommand implements ICommand<AddSeasonCommandOptions> {
  public readonly name = 'add-season';

  constructor(private readonly dbContext: DbContext, private readonly logger: Logger) {}

  public configure(argv: Argv): Argv {
    return argv.command(`${this.name} <file...>`, 'Add season', yargs =>
      yargs.positional('file', {
        type: 'string'
      })
    );
  }

  public async run(args: Arguments<AddSeasonCommandOptions>): Promise<void> {
    for (const file of args.file) {
      await this.addSeason(file);
    }
  }

  private async addSeason(file: string): Promise<void> {
    this.logger.info(`Adding season from: ${file}`);

    const season = JSON.parse(fs.readFileSync(file, 'utf-8')) as Season;

    await this.addSeasonInfo(season);
    await this.addTeams(season.year, season.teams);
    await this.addSchedule(season.year, season.schedule);
  }

  private async addSeasonInfo(season: Season): Promise<void> {
    const seasonExists = await this.dbContext.seasonInfo.exists({ year: season.year });

    const data: Partial<SeasonInfo> = {
      numTeams: season.numTeams,
      numPlayoffTeams: season.numPlayoffTeams,
      regularSeasonLength: season.regularSeasonLength,
      playoffLength: season.playoffLength,
      tiebreaker: Tiebreaker[season.tiebreaker]
    };

    if (seasonExists) {
      this.logger.info(`Update season info for ${season.year}`);
      await this.dbContext.seasonInfo.update({ year: season.year }, data);
    } else {
      this.logger.info(`Add season info for ${season.year}`);
      await this.dbContext.seasonInfo.insert({ year: season.year, ...data });
    }
  }

  private async addTeams(year: number, teams: SeasonTeam[]): Promise<void> {
    await Promise.all(
      teams.map(async team => {
        const teamId = await (async () => {
          // check if team already exists for this owner
          const existingTeam = await this.dbContext.teams.select(
            { owner: team.owner },
            true
          );

          if (existingTeam) {
            return existingTeam.id;
          }

          // create new team
          this.logger.info(`Create team for ${team.owner}`);
          return await this.dbContext.teams.insert({ owner: team.owner });
        })();

        if (await this.dbContext.teamNames.exists({ teamId, year })) {
          return;
        }

        this.logger.info(`Set team name "${team.name}" for ${team.owner} in ${year}`);
        await this.dbContext.teamNames.insert({ teamId, year, name: team.name });
      })
    );
  }

  private async addSchedule(
    year: number,
    schedule: Schedule,
    force = false
  ): Promise<void> {
    let weeksInDb = await this.dbContext.games.getWeeksInYear(year);

    if (weeksInDb.length > 0 && force) {
      // TODO: delete games in db
      weeksInDb = [];
    }

    const teams = new Map(
      (await this.dbContext.teams.select()).map(team => [team.owner, team])
    );
    const gamesToAdd: Pick<Game, 'year' | 'week' | 'gameScores'>[] = [];

    schedule.forEach(scheduleWeek => {
      if (weeksInDb.includes(scheduleWeek.week)) {
        // this week already exists in database
        return;
      }

      scheduleWeek.games.forEach(game => {
        if (!teams.has(game.team1)) {
          throw new Error(`Cannot find team ${game.team1}`);
        }
        if (!teams.has(game.team2)) {
          throw new Error(`Cannot find team ${game.team2}`);
        }

        const team1 = teams.get(game.team1);
        const team2 = teams.get(game.team2);

        gamesToAdd.push({
          year,
          week: scheduleWeek.week,
          gameScores: [
            {
              year,
              week: scheduleWeek.week,
              teamId: team1.id,
              gameId: 0 // NOTE: should not be needed
            },
            {
              year,
              week: scheduleWeek.week,
              teamId: team2.id,
              gameId: 0 // NOTE: should not be needed
            }
          ]
        });
      });
    });

    await this.dbContext.games.insertWithGameScores(gamesToAdd);
  }
}
