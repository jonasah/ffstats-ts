import { AddScheduleCommand } from './addScheduleCommand';

describe('Add schedule command', () => {
  let command: AddScheduleCommand;

  beforeEach(() => {
    command = new AddScheduleCommand();
  });

  it('should succeed with file argument', () => {
    const args = ['schedule-file.json'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should fail on missing file argument', () => {
    const args: string[] = [];
    expect(() => {
      command.parseArguments(args);
    }).toThrow();
  });

  it('should fail on multiple file arguments', () => {
    const args = ['schedule-file1.json', 'schedule-file2.json'];
    expect(() => {
      command.parseArguments(args);
    }).toThrow();
  });
});
