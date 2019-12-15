import { Service } from 'typedi';
import { Argv } from 'yargs';
import { ICommand } from '../command.interface';

interface CalculatePlayoffProbCommandOptions {
  year: number;
  week: number[];
}

@Service()
export class CalculatePlayoffProbCommand
  implements ICommand<CalculatePlayoffProbCommandOptions> {
  public readonly name = 'calculate-playoff-prob';

  public configure(argv: Argv): Argv {
    return argv.command(
      `${this.name} <year> <week...>`,
      'Calculate playoff probabilities',
      yargs => {
        yargs
          .positional('year', {
            type: 'number'
          })
          .positional('week', {
            type: 'number'
          });
      }
    );
  }

  public async run(/*args: Arguments<CalculatePlayoffProbCommandOptions>*/): Promise<
    void
  > {
    // TODO
  }
}
