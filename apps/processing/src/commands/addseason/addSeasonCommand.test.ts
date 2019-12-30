import yargs, { Argv } from 'yargs';
import { mockLogger } from '../../../../../libs/logger/src/logger.mock';
import { parseArguments } from '../testUtils/parseArguments';
import { AddSeasonCommand } from './addSeasonCommand';

describe('Add season command', () => {
  let command: AddSeasonCommand;
  let argv: Argv;

  beforeEach(() => {
    command = new AddSeasonCommand({} as any, mockLogger);
    argv = command.configure(yargs);
  });

  it('should succeed with single file argument', async () => {
    const args = await parseArguments(argv, 'add-season season-file.json');
    expect(args.file).toEqual(['season-file.json']);
  });

  it('should succeed with multiple file arguments', async () => {
    const args = await parseArguments(
      argv,
      'add-season season-file.json season-file2.json'
    );
    expect(args.file).toEqual(['season-file.json', 'season-file2.json']);
  });

  it('should fail on missing file argument', async () => {
    expect.assertions(1);
    await expect(parseArguments(argv, 'add-season')).rejects.toEqual(expect.any(Error));
  });
});
