import { mockLogger } from '../../../../../libs/logger/src/logger.mock';
import { AddPlayoffProbCommand } from './addPlayoffProbCommand';

describe('Add playoff prob command', () => {
  let command: AddPlayoffProbCommand;

  beforeEach(() => {
    command = new AddPlayoffProbCommand({} as any, mockLogger);
  });

  it('should succeed with single file argument', () => {
    const args = ['-f', 'playoff-prob-file.json'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed with multiple file arguments', () => {
    const args = ['-f', 'playoff-prob-file1.json', 'playoff-prob-file2.json'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed with single directory argument', () => {
    const args = ['-d', 'playoff-prob-directory'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed with multiple directory arguments', () => {
    const args = ['-d', 'playoff-prob-directory', 'playoff-prob-directory2'];
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
