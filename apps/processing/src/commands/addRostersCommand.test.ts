import { AddRostersCommand } from './addRostersCommand';

const mockLogger: any = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

describe('Add rosters command', () => {
  let command: AddRostersCommand;

  beforeEach(() => {
    command = new AddRostersCommand({} as any, mockLogger);
  });

  it('should succeed with single file argument', () => {
    const args = ['-f', 'rosters-file.json'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed with multiple file arguments', () => {
    const args = ['-f', 'rosters-file1.json', 'rosters-file2.json'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed with single directory argument', () => {
    const args = ['-d', 'rosters-directory'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed with multiple directory arguments', () => {
    const args = ['-d', 'rosters-directory', 'rosters-directory2'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should warn on missing file and directory arguments', () => {
    const args: string[] = [];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
    expect(mockLogger.warn).toHaveBeenCalled();
  });
});
