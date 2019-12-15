import { Inject, Service, Token } from 'typedi';
import yargs from 'yargs';
import { IApp } from '../../common';
import { ICommand } from './commands/command.interface';

export const commandsToken = new Token<ICommand<unknown>[]>('commandsToken');

@Service()
export class ProcessingApp implements IApp {
  constructor(
    @Inject(commandsToken) private readonly availableCommands: ICommand<unknown>[]
  ) {}

  public async run(): Promise<number> {
    const argv = this.availableCommands.reduce(
      (argv, command) => command.configure(argv),
      yargs
        .version(false)
        .help()
        .alias('h', 'help')
        .demandCommand(1)
    ).argv;

    const command = this.availableCommands.find(cmd => cmd.name === argv._[0]);
    await command.run(argv);

    return 0;
  }
}
