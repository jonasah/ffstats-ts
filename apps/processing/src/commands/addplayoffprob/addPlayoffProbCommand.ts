import { DbContext } from '@ffstats/database';
import { Logger } from '@ffstats/logger';
import { PlayoffProbability } from '@ffstats/models';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import path from 'path';
import { Service } from 'typedi';
import { PlayoffProbabilities } from '../../models/playoffProbability';
import { ICommand } from '../command.interface';

@Service()
export class AddPlayoffProbCommand implements ICommand {
  public readonly name = 'add-playoff-prob';

  private files: string[];
  private directories: string[];

  constructor(private readonly dbContext: DbContext, private readonly logger: Logger) {}

  public parseArguments(args: string[]): void {
    const definitions: commandLineArgs.OptionDefinition[] = [
      {
        name: 'file',
        alias: 'f',
        multiple: true
      },
      {
        name: 'directory',
        alias: 'd',
        multiple: true
      }
    ];

    const options = commandLineArgs(definitions, {
      argv: args || []
    });

    this.files = options.file || [];
    this.directories = options.directory || [];

    if (this.files.length === 0 && this.directories.length === 0) {
      this.logger.warn('No playoff prob files or directories specified');
    }
  }

  public async run(): Promise<void> {
    for (const file of this.files) {
      await this.addFromFile(file);
    }

    for (const directory of this.directories) {
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
