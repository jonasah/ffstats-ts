import { AddScheduleCommand } from './addScheduleCommand';

const mockLogger: any = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

describe('Add schedule command', () => {
  let command: AddScheduleCommand;

  beforeEach(() => {
    command = new AddScheduleCommand({} as any, mockLogger);
  });

  it('should succeed with single file argument', () => {
    const args = ['schedule-file.json'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed with multiple file arguments', () => {
    const args = ['schedule-file1.json', 'schedule-file2.json'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should warn on missing file argument', () => {
    const args: string[] = [];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
    expect(mockLogger.warn).toHaveBeenCalled();
  });
});
