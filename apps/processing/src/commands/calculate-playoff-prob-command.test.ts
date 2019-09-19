import { CalculatePlayoffProbCommand } from './calculate-playoff-prob-command';

describe('Calculate playoff prob command', () => {
  let command: CalculatePlayoffProbCommand;

  beforeEach(() => {
    command = new CalculatePlayoffProbCommand();
  });

  it('should succeed on year and single week', () => {
    const args = ['-y', '2018', '-w', '4'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should succeed on year and multiple weeks', () => {
    const args = ['-y', '2018', '-w', '4', '5'];
    expect(() => {
      command.parseArguments(args);
    }).not.toThrow();
  });

  it('should fail on missing year', () => {
    const args = ['-w', '4'];
    expect(() => {
      command.parseArguments(args);
    }).toThrow();
  });

  it('should fail on missing weeks', () => {
    const args = ['-y', '2018'];
    expect(() => {
      command.parseArguments(args);
    }).toThrow();
  });
});
