import yargs, { Argv } from 'yargs';
import { parseArguments } from '../testUtils/parseArguments';
import { AddScheduleCommand } from './addScheduleCommand';

describe('Add schedule command', () => {
  let command: AddScheduleCommand;
  let argv: Argv;

  beforeEach(() => {
    command = new AddScheduleCommand({} as any);
    argv = command.configure(yargs);
  });

  it('should succeed with single file argument', async () => {
    const args = await parseArguments(argv, 'add-schedule schedule-file.json');
    expect(args.file).toEqual(['schedule-file.json']);
  });

  it('should succeed with multiple file arguments', async () => {
    const args = await parseArguments(
      argv,
      'add-schedule schedule-file.json schedule-file2.json'
    );
    expect(args.file).toEqual(['schedule-file.json', 'schedule-file2.json']);
  });

  it('should fail on missing file argument', async () => {
    expect.assertions(1);
    await expect(parseArguments(argv, 'add-schedule')).rejects.toEqual(expect.any(Error));
  });
});
