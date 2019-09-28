import { GameRepository, SeasonInfoRepository, TeamRepository } from '@ffstats/database';
import { Logger } from '@ffstats/logger';
import commandLineArgs from 'command-line-args';
import { Service } from 'typedi';
import { addSchedule } from '../scheduleFunctions';
import { ICommand } from './command.interface';

@Service()
export class AddScheduleCommand implements ICommand {
  public readonly name = 'add-schedule';

  private files: string[];

  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly gameRepository: GameRepository,
    private readonly seasonInfoRepository: SeasonInfoRepository,
    private readonly logger: Logger
  ) {}

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
      await addSchedule(
        file,
        this.teamRepository,
        this.gameRepository,
        this.seasonInfoRepository
      );
    }
  }
}
