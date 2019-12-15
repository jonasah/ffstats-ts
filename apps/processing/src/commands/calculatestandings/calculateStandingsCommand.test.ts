import yargs, { Argv } from 'yargs';
import { mockLogger } from '../../../../../libs/logger/src/logger.mock';
import { parseArguments } from '../testUtils/parseArguments';
import { CalculateStandingsCommand } from './calculateStandingsCommand';

describe('Calculate standings command', () => {
  let command: CalculateStandingsCommand;
  let argv: Argv;

  beforeEach(() => {
    command = new CalculateStandingsCommand({} as any, mockLogger);
    argv = command.configure(yargs);
  });

  it('should succeed on year and single week', async () => {
    const args = await parseArguments(argv, 'calculate-standings 2018 4');
    expect(args.year).toBe(2018);
    expect(args.week).toEqual([4]);
  });

  it('should succeed on year and multiple weeks', async () => {
    const args = await parseArguments(argv, 'calculate-standings 2018 4 5');
    expect(args.year).toBe(2018);
    expect(args.week).toEqual([4, 5]);
  });

  it('should fail on too few arguments', async () => {
    expect.assertions(2);
    await expect(parseArguments(argv, 'calculate-standings')).rejects.toEqual(
      expect.any(Error)
    );
    await expect(parseArguments(argv, 'calculate-standings 2018')).rejects.toEqual(
      expect.any(Error)
    );
  });
});
