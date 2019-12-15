import { Arguments, Argv } from 'yargs';

export interface ICommand<TOptions> {
  name: string;

  configure(argv: Argv): Argv;
  run(args: Arguments<TOptions>): Promise<void>;
}
