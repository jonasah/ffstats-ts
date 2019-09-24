import commandLineArgs, { OptionDefinition } from 'command-line-args';

import { ICommand } from './command.interface';

export function getCommand(availableCommands: ICommand[], args?: string[]): ICommand {
  const mainDefinitions: commandLineArgs.OptionDefinition[] = [
    {
      name: 'command',
      defaultOption: true
    }
  ];

  const mainOptions = commandLineArgs(mainDefinitions, {
    argv: args,
    stopAtFirstUnknown: true
  });

  if (mainOptions.command == null) {
    throw new Error('No command specified');
  }

  const selectedCommand = availableCommands.find(
    command => command.name === mainOptions.command
  );

  if (selectedCommand == null) {
    throw new Error(`Unknown command: ${mainOptions.command}`);
  }

  selectedCommand.parseArguments(mainOptions._unknown);

  return selectedCommand;
}
