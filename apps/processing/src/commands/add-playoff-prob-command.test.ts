import { AddPlayoffProbCommand } from './add-playoff-prob-command';

describe('Add playoff prob command', () => {
  let command: AddPlayoffProbCommand;

  beforeEach(() => {
    command = new AddPlayoffProbCommand();
  });

  it('should succeed with file argument', () => {
    const args = ['-f', 'playoff-prob-file.json'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed with directory argument', () => {
    const args = ['-d', 'playoff-prob-directory'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should fail on missing file and directory arguments', () => {
    const args: string[] = [];
    expect(() => {
      command.parseArguments(args);
    }).toThrow();
  });

  it('should fail on multiple file arguments', () => {
    const args = ['-f', 'playoff-prob-file1.json', '-f', 'playoff-prob-file2.json'];
    expect(() => {
      command.parseArguments(args);
    }).toThrow();
  });

  it('should fail on multiple directory arguments', () => {
    const args = ['-d', 'playoff-prob-directory1', '-d', 'playoff-prob-directory2'];
    expect(() => {
      command.parseArguments(args);
    }).toThrow();
  });
});
