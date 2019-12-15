import yargs, { Argv } from 'yargs';
import { mockLogger } from '../../../../../libs/logger/src/logger.mock';
import { parseArguments } from '../testUtils/parseArguments';
import { AddTeamsCommand } from './addTeamsCommand';

describe('Add teams command', () => {
  let command: AddTeamsCommand;
  let argv: Argv;

  beforeEach(() => {
    command = new AddTeamsCommand({} as any, mockLogger);
    argv = command.configure(yargs);
  });

  it('should succeed with single file argument', async () => {
    const args = await parseArguments(argv, 'add-teams teams-file.json');
    expect(args.file).toEqual(['teams-file.json']);
  });

  it('should succeed with multiple file arguments', async () => {
    const args = await parseArguments(argv, 'add-teams teams-file.json teams-file2.json');
    expect(args.file).toEqual(['teams-file.json', 'teams-file2.json']);
  });

  it('should fail on missing file argument', async () => {
    expect.assertions(1);
    await expect(parseArguments(argv, 'add-teams')).rejects.toEqual(expect.any(Error));
  });
});
