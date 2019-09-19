import { AddRostersCommand } from './add-rosters-command';

describe('Add rosters command', () => {
  let command: AddRostersCommand;

  beforeEach(() => {
    command = new AddRostersCommand();
  });

  it('should succeed with file argument', () => {
    const args = ['-f', 'rosters-file.json'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed with directory argument', () => {
    const args = ['-d', 'rosters-directory'];
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
    const args = ['-f', 'rosters-file1.json', '-f', 'rosters-file2.json'];
    expect(() => {
      command.parseArguments(args);
    }).toThrow();
  });

  it('should fail on multiple directory arguments', () => {
    const args = ['-d', 'rosters-directory1', '-d', 'rosters-directory2'];
    expect(() => {
      command.parseArguments(args);
    }).toThrow();
  });
});
