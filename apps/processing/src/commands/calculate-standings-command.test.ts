import { CalculateStandingsCommand } from './calculate-standings-command';

describe('Calculate standings command', () => {
  let command: CalculateStandingsCommand;

  beforeEach(() => {
    command = new CalculateStandingsCommand();
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