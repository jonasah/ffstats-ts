import commandLineArgs from 'command-line-args';

import { ICommand } from './command.interface';

export class AddPlayoffProbCommand implements ICommand {
  public readonly name = 'add-playoff-prob';

  private file: string;
  private directory: string;

  public parseArguments(args: string[]): void {
    const definitions: commandLineArgs.OptionDefinition[] = [
      {
        name: 'file',
        alias: 'f',
        type: String
      },
      {
        name: 'directory',
        alias: 'd',
        type: String
      }
    ];

    const options = commandLineArgs(definitions, {
      argv: args || []
    });

    this.file = options.file;
    this.directory = options.directory;

    if (this.file == null && this.directory == null) {
      throw new Error('No playoff prob file or directory specified');
    }
  }

  public run(): void {
    // TODO
  }
}
