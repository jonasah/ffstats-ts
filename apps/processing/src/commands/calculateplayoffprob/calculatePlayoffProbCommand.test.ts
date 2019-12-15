import yargs, { Argv } from 'yargs';
import { parseArguments } from '../testUtils/parseArguments';
import { CalculatePlayoffProbCommand } from './calculatePlayoffProbCommand';

describe('Calculate playoff prob command', () => {
  let command: CalculatePlayoffProbCommand;
  let argv: Argv;

  beforeEach(() => {
    command = new CalculatePlayoffProbCommand();
    argv = command.configure(yargs);
  });

  it('should succeed on year and single week', async () => {
    const args = await parseArguments(argv, 'calculate-playoff-prob 2018 4');
    expect(args.year).toBe(2018);
    expect(args.week).toEqual([4]);
  });

  it('should succeed on year and multiple weeks', async () => {
    const args = await parseArguments(argv, 'calculate-playoff-prob 2018 4 5');
    expect(args.year).toBe(2018);
    expect(args.week).toEqual([4, 5]);
  });

  it('should fail on too few arguments', async () => {
    expect.assertions(2);
    await expect(parseArguments(argv, 'calculate-playoff-prob')).rejects.toEqual(
      expect.any(Error)
    );
    await expect(parseArguments(argv, 'calculate-playoff-prob 2018')).rejects.toEqual(
      expect.any(Error)
    );
  });
});
