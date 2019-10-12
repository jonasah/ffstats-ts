import { mockLogger } from '../../../../libs/logger/src/logger.mock';
import { AddRostersCommand } from './addRostersCommand';
import { AddScheduleCommand } from './addScheduleCommand';
import { CalculateStandingsCommand } from './calculateStandingsCommand';
import { ICommand } from './command.interface';
import { getCommand } from './getCommand';

describe('getCommand', () => {
  let addScheduleCommand: AddScheduleCommand;
  let addRostersCommand: AddRostersCommand;
  let calculateStandingsCommand: CalculateStandingsCommand;

  let availableCommands: ICommand[];

  beforeAll(() => {
    addScheduleCommand = new AddScheduleCommand({} as any, mockLogger);
    addRostersCommand = new AddRostersCommand({} as any, mockLogger);
    calculateStandingsCommand = new CalculateStandingsCommand({} as any, mockLogger);

    availableCommands = [
      addScheduleCommand,
      addRostersCommand,
      calculateStandingsCommand
    ];
  });

  it('should return correct command', () => {
    const args = [addScheduleCommand.name, 'schedule-file.json'];
    const command = getCommand(availableCommands, args);
    expect(command).toBe(addScheduleCommand);
  });

  it('should fail on no command', () => {
    const args = [];
    expect(() => {
      getCommand(availableCommands, args);
    }).toThrowError('No command specified');
  });

  it('should fail on unknown command', () => {
    const args = ['unknown'];
    expect(() => {
      getCommand(availableCommands, args);
    }).toThrowError('Unknown command: unknown');
  });
});
