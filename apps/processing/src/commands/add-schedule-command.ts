import commandLineArgs from 'command-line-args';

import { ICommand } from './command.interface';

export class AddScheduleCommand implements ICommand {
  public readonly name = 'add-schedule';

  private file: string;

  public parseArguments(args: string[]): void {
    const definitions: commandLineArgs.OptionDefinition[] = [
      {
        name: 'file',
        defaultOption: true
      }
    ];

    const options = commandLineArgs(definitions, {
      argv: args || []
    });

    this.file = options.file;

    if (this.file == null) {
      throw new Error('No schedule file specified');
    }
  }

  public run(): void {
    // TODO
  }
}
