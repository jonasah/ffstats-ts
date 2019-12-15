import { DbContext } from '@ffstats/database';
import { Logger } from '@ffstats/logger';
import { PlayoffProbability } from '@ffstats/models';
import fs from 'fs';
import path from 'path';
import { Service } from 'typedi';
import { Arguments, Argv } from 'yargs';
import { PlayoffProbabilities } from '../../models/playoffProbability';
import { ICommand } from '../command.interface';

interface AddPlayoffProbCommandOptions {
  file?: string[];
  directory?: string[];
}

@Service()
export class AddPlayoffProbCommand implements ICommand<AddPlayoffProbCommandOptions> {
  public readonly name = 'add-playoff-prob';

  constructor(private readonly dbContext: DbContext, private readonly logger: Logger) {}

  public configure(argv: Argv): Argv {
    return argv.command(`${this.name} [options]`, 'Add playoff probabilities', yargs => {
      yargs
        .option('file', {
          alias: 'f',
          type: 'string',
          array: true
        })
        .option('directory', {
          alias: 'd',
          type: 'string',
          array: true
        })
        .check(argv => {
          if ((argv.file || []).length > 0 || (argv.directory || []).length > 0) {
            return true;
          }

          throw new Error('File and/or directory is required');
        });
    });
  }

  public async run(args: Arguments<AddPlayoffProbCommandOptions>): Promise<void> {
    for (const file of args.file || []) {
      await this.addFromFile(file);
    }

    for (const directory of args.directory || []) {
      await this.addFromDirectory(directory);
    }
  }

  private async addFromFile(file: string, force?: boolean): Promise<void> {
    this.logger.info(`Adding playoff probabilities from: ${file}`);

    const playoffProbs = JSON.parse(
      fs.readFileSync(file, 'utf-8')
    ) as PlayoffProbabilities;

    const weekExists = await this.dbContext.playoffProbability.weekExists(
      playoffProbs.year,
      playoffProbs.week
    );

    if (weekExists) {
      if (force) {
        await this.dbContext.playoffProbability.delete({
          year: playoffProbs.year,
          week: playoffProbs.week
        });
      } else {
        return;
      }
    }

    const teams = await this.dbContext.teams.select();
    const playoffProbsToAdd: Partial<PlayoffProbability>[] = [];

    for (const playoffProb of playoffProbs.probability) {
      this.logger.info(` Adding playoff prob for ${playoffProb.team}`);

      if (playoffProb.excludingTiebreakers > playoffProb.includingTiebreakers) {
        throw new Error(
          `Excluding (${playoffProb.excludingTiebreakers}) > Including (${playoffProb.includingTiebreakers})`
        );
      }

      const team = teams.find(t => t.owner === playoffProb.team);

      playoffProbsToAdd.push({
        year: playoffProbs.year,
        week: playoffProbs.week,
        team_id: team.id,
        including_tiebreaker: playoffProb.includingTiebreakers,
        excluding_tiebreaker: playoffProb.excludingTiebreakers
      });
    }

    await this.dbContext.playoffProbability.insert(playoffProbsToAdd);
  }

  private async addFromDirectory(directory: string, force?: boolean): Promise<void> {
    const dirFiles = fs
      .readdirSync(directory)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(directory, file));

    for (const file of dirFiles) {
      await this.addFromFile(file, force);
    }
  }
}
