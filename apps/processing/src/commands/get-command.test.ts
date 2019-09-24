import { AddRostersCommand } from './add-rosters-command';
import { AddScheduleCommand } from './add-schedule-command';
import { CalculateStandingsCommand } from './calculate-standings-command';
import { ICommand } from './command.interface';
import { getCommand } from './get-command';

describe('getCommand', () => {
  let addScheduleCommand: AddScheduleCommand;
  let addRostersCommand: AddRostersCommand;
  let calculateStandingsCommand: CalculateStandingsCommand;

  let availableCommands: ICommand[];

  beforeAll(() => {
    addScheduleCommand = new AddScheduleCommand();
    addRostersCommand = new AddRostersCommand();
    calculateStandingsCommand = new CalculateStandingsCommand();

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
