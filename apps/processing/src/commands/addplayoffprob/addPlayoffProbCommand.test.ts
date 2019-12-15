import yargs, { Argv } from 'yargs';
import { mockLogger } from '../../../../../libs/logger/src/logger.mock';
import { parseArguments } from '../testUtils/parseArguments';
import { AddPlayoffProbCommand } from './addPlayoffProbCommand';

describe('Add playoff prob command', () => {
  let command: AddPlayoffProbCommand;
  let argv: Argv;

  beforeEach(() => {
    command = new AddPlayoffProbCommand({} as any, mockLogger);
    argv = command.configure(yargs);
  });

  it('should succeed with single file argument', async () => {
    const args = await parseArguments(argv, 'add-playoff-prob -f playoff-prob-file.json');
    expect(args.file).toEqual(['playoff-prob-file.json']);
    expect(args.directory).toBeUndefined();
  });

  it('should succeed with multiple file arguments', async () => {
    const args = await parseArguments(
      argv,
      'add-playoff-prob -f playoff-prob-file.json playoff-prob-file2.json'
    );
    expect(args.file).toEqual(['playoff-prob-file.json', 'playoff-prob-file2.json']);
    expect(args.directory).toBeUndefined();
  });

  it('should succeed with single directory argument', async () => {
    const args = await parseArguments(argv, 'add-playoff-prob -d playoff-prob-directory');
    expect(args.file).toBeUndefined();
    expect(args.directory).toEqual(['playoff-prob-directory']);
  });

  it('should succeed with multiple directory arguments', async () => {
    const args = await parseArguments(
      argv,
      'add-playoff-prob -d playoff-prob-directory playoff-prob-directory2'
    );
    expect(args.file).toBeUndefined();
    expect(args.directory).toEqual(['playoff-prob-directory', 'playoff-prob-directory2']);
  });

  it('should succeed with both file and directory arguments', async () => {
    const args = await parseArguments(
      argv,
      'add-playoff-prob -f playoff-prob-file.json -d playoff-prob-directory'
    );
    expect(args.file).toEqual(['playoff-prob-file.json']);
    expect(args.directory).toEqual(['playoff-prob-directory']);
  });

  it('should fail on missing file and directory arguments', async () => {
    expect.assertions(1);
    await expect(parseArguments(argv, 'add-playoff-prob')).rejects.toEqual(
      expect.any(Error)
    );
  });
});
