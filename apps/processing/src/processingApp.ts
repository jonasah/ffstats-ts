import { Logger } from '@ffstats/logger';
import { Inject, Service, Token } from 'typedi';
import { IApp } from '../../common';
import { ICommand } from './commands/command.interface';
import { getCommand } from './commands/getCommand';

export const commandsToken = new Token<ICommand[]>('commandsToken');

@Service()
export class ProcessingApp implements IApp {
  constructor(
    @Inject(commandsToken) private readonly availableCommands: ICommand[],
    private readonly logger: Logger
  ) {}

  public async run(): Promise<number> {
    const command = (() => {
      try {
        return getCommand(this.availableCommands);
      } catch (e) {
        this.logger.error(e.message, e.stack);
      }
    })();

    if (command == null) {
      return 1;
    }

    try {
      await command.run();
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return 1;
    }

    return 0;
  }
}
