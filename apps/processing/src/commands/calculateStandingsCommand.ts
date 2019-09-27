import commandLineArgs from 'command-line-args';

import { ICommand } from './command.interface';

export class CalculateStandingsCommand implements ICommand {
  public readonly name = 'calculate-standings';

  private year: number;
  private weeks: number[];

  public parseArguments(args: string[]): void {
    const definitions: commandLineArgs.OptionDefinition[] = [
      {
        name: 'year',
        alias: 'y',
        type: Number
      },
      {
        name: 'week',
        alias: 'w',
        type: Number,
        multiple: true
      }
    ];

    const options = commandLineArgs(definitions, {
      argv: args || []
    });

    this.year = options.year;
    this.weeks = options.week;

    if (!this.year || !this.weeks) {
      throw new Error('Missing year and/or weeks');
    }
  }

  public run(): void {
    // TODO
  }
}
