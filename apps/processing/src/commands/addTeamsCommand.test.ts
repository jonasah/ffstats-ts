import { mockLogger } from '../../../../libs/logger/src/logger.mock';
import { AddTeamsCommand } from './addTeamsCommand';

describe('Add schedule command', () => {
  let command: AddTeamsCommand;

  beforeEach(() => {
    command = new AddTeamsCommand({} as any, mockLogger);
  });

  it('should succeed with single file argument', () => {
    const args = ['teams-file.json'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed with multiple file arguments', () => {
    const args = ['teams-file1.json', 'teams-file2.json'];
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
