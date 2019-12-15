import yargs, { Argv } from 'yargs';
import { mockLogger } from '../../../../../libs/logger/src/logger.mock';
import { parseArguments } from '../testUtils/parseArguments';
import { AddRostersCommand } from './addRostersCommand';

describe('Add rosters command', () => {
  let command: AddRostersCommand;
  let argv: Argv;

  beforeEach(() => {
    command = new AddRostersCommand({} as any, mockLogger);
    argv = command.configure(yargs);
  });

  it('should succeed with single file argument', async () => {
    const args = await parseArguments(argv, 'add-rosters -f rosters-file.json');
    expect(args.file).toEqual(['rosters-file.json']);
    expect(args.directory).toBeUndefined();
  });

  it('should succeed with multiple file arguments', async () => {
    const args = await parseArguments(
      argv,
      'add-rosters -f rosters-file.json rosters-file2.json'
    );
    expect(args.file).toEqual(['rosters-file.json', 'rosters-file2.json']);
    expect(args.directory).toBeUndefined();
  });

  it('should succeed with single directory argument', async () => {
    const args = await parseArguments(argv, 'add-rosters -d rosters-directory');
    expect(args.file).toBeUndefined();
    expect(args.directory).toEqual(['rosters-directory']);
  });

  it('should succeed with multiple directory arguments', async () => {
    const args = await parseArguments(
      argv,
      'add-rosters -d rosters-directory rosters-directory2'
    );
    expect(args.file).toBeUndefined();
    expect(args.directory).toEqual(['rosters-directory', 'rosters-directory2']);
  });

  it('should succeed with both file and directory arguments', async () => {
    const args = await parseArguments(
      argv,
      'add-rosters -f rosters-file.json -d rosters-directory'
    );
    expect(args.file).toEqual(['rosters-file.json']);
    expect(args.directory).toEqual(['rosters-directory']);
  });

  it('should fail on missing file and directory arguments', async () => {
    expect.assertions(1);
    await expect(parseArguments(argv, 'add-rosters')).rejects.toEqual(expect.any(Error));
  });
});
