import { DbContext } from '@ffstats/database';
import { Logger } from '@ffstats/logger';
import { hasValidResult, seasonLength } from '@ffstats/models';
import { Service } from 'typedi';
import { Arguments, Argv } from 'yargs';
import { PlayoffStandings } from '../../utils/playoffStandings';
import { RegularSeasonStandings } from '../../utils/regularSeasonStandings';
import { Standings } from '../../utils/standings';
import { ICommand } from '../command.interface';
import { getStandings } from './getStandings';

interface CalculateStandingsCommandOptions {
  year: number;
  week: number[];
}

@Service()
export class CalculateStandingsCommand
  implements ICommand<CalculateStandingsCommandOptions> {
  public readonly name = 'calculate-standings';

  constructor(private readonly dbContext: DbContext, private readonly logger: Logger) {}

  public configure(argv: Argv): Argv {
    return argv.command(`${this.name} <year> <week...>`, 'Calculate standings', yargs => {
      yargs
        .positional('year', {
          type: 'number'
        })
        .positional('week', {
          type: 'number'
        });
    });
  }

  public async run(args: Arguments<CalculateStandingsCommandOptions>): Promise<void> {
    for (const week of args.week) {
      await this.calculateStandings(args.year, week);
    }
  }

  private async calculateStandings(
    year: number,
    week: number,
    force?: boolean
  ): Promise<Standings> {
    const weekExists = await this.dbContext.teamRecords.weekExists(year, week);

    if (weekExists) {
      if (force) {
        await this.dbContext.teamRecords.delete({ year, week });
      } else {
        return getStandings(year, week, this.dbContext);
      }
    }

    let prevStandings = await getStandings(year, week - 1, this.dbContext);

    if (!prevStandings.isValid()) {
      // previous week's standings does not exist yet
      prevStandings = await this.calculateStandings(year, week - 1, force);
    }

    this.logger.info(`Calculating standings for ${year} week ${week}`);

    const seasonInfo = await this.dbContext.seasonInfo.select({ year }, true);

    const newStandings =
      week <= seasonInfo.regular_season_length
        ? RegularSeasonStandings.fromPreviousStandings(prevStandings)
        : PlayoffStandings.fromPreviousStandings(prevStandings);

    const games = await this.dbContext.games.getByWeek(year, week);

    games
      .filter(game => hasValidResult(game))
      .forEach(game => newStandings.addResult(game));

    newStandings.sortStandings();

    await this.dbContext.teamRecords.insertWithHead2HeadRecords(newStandings.teamRecords);

    // update season info
    if (week <= seasonInfo.regular_season_length) {
      const highestPointsForRecord = newStandings.getHighestPointsForRecord();
      seasonInfo.highest_points_for = highestPointsForRecord.points_for;
      seasonInfo.highest_points_for_team_id = highestPointsForRecord.team_id;

      if (week === seasonInfo.regular_season_length) {
        seasonInfo.regular_season_champion_id = newStandings.teamRecords[0].team_id;
      }
    } else if (week === seasonLength(seasonInfo)) {
      seasonInfo.champion_id = newStandings.teamRecords[0].team_id;
      seasonInfo.second_place_id = newStandings.teamRecords[1].team_id;
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      seasonInfo.third_place_id = newStandings.teamRecords[2].team_id;
      seasonInfo.sacko_id =
        newStandings.teamRecords[newStandings.teamRecords.length - 1].team_id;
    }

    await this.dbContext.seasonInfo.update({ id: seasonInfo.id }, seasonInfo);

    return newStandings;
  }
}
