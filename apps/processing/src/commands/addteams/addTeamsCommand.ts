import { DbContext } from '@ffstats/database';
import { Logger } from '@ffstats/logger';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import { Service } from 'typedi';
import { SeasonTeams } from '../../models/seasonTeams';
import { ICommand } from '../command.interface';

@Service()
export class AddTeamsCommand implements ICommand {
  public readonly name = 'add-teams';

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
      this.logger.warn('No file(s) specified');
    }
  }

  public async run(): Promise<void> {
    for (const file of this.files) {
      await this.handleFile(file);
    }
  }

  private async handleFile(file: string): Promise<void> {
    const teams = JSON.parse(fs.readFileSync(file, 'utf-8')) as SeasonTeams;

    await Promise.all(
      teams.teams.map(async team => {
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

        // TODO: check if team name already exists
        this.logger.info(
          `Set team name "${team.name}" for ${team.owner} in ${teams.year}`
        );
        await this.dbContext.teamNames.insert({
          team_id: teamId,
          year: teams.year,
          name: team.name
        });
      })
    );
  }
}
