import { createLogger } from '@ffstats/logger';
import { Service } from 'typedi';

import { IApp } from '../../common';
import { AddPlayoffProbCommand } from './commands/add-playoff-prob-command';
import { AddRostersCommand } from './commands/add-rosters-command';
import { AddScheduleCommand } from './commands/add-schedule-command';
import { CalculatePlayoffProbCommand } from './commands/calculate-playoff-prob-command';
import { CalculateStandingsCommand } from './commands/calculate-standings-command';
import { ICommand } from './commands/command.interface';
import { getCommand } from './commands/get-command';

@Service()
export class ProcessingApp implements IApp {
  public async run(): Promise<number> {
    const logger = createLogger();

    const availableCommands: ICommand[] = [
      new AddScheduleCommand(),
      new AddRostersCommand(),
      new AddPlayoffProbCommand(),
      new CalculateStandingsCommand(),
      new CalculatePlayoffProbCommand()
    ];

    const command = (() => {
      try {
        return getCommand(availableCommands);
      } catch (e) {
        logger.error(e.message);
      }
    })();

    if (command == null) {
      return -1;
    }

    command.run();

    return 0;
  }
}
