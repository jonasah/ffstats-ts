import { createLogger } from '@ffstats/logger';
import { Service } from 'typedi';

import { IApp } from '../../common';
import { AddPlayoffProbCommand } from './commands/addPlayoffProbCommand';
import { AddRostersCommand } from './commands/addRostersCommand';
import { AddScheduleCommand } from './commands/addScheduleCommand';
import { CalculatePlayoffProbCommand } from './commands/calculatePlayoffProbCommand';
import { CalculateStandingsCommand } from './commands/calculateStandingsCommand';
import { ICommand } from './commands/command.interface';
import { getCommand } from './commands/getCommand';

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
