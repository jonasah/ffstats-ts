import 'reflect-metadata';

import { Container } from 'typedi';

import { AddPlayoffProbCommand } from './commands/addPlayoffProbCommand';
import { AddRostersCommand } from './commands/addRostersCommand';
import { AddScheduleCommand } from './commands/addScheduleCommand';
import { AddTeamsCommand } from './commands/addTeamsCommand';
import { CalculatePlayoffProbCommand } from './commands/calculatePlayoffProbCommand';
import { CalculateStandingsCommand } from './commands/calculateStandingsCommand';
import { commandsToken, ProcessingApp } from './processingApp';

Container.set(commandsToken, [
  Container.get(AddTeamsCommand),
  Container.get(AddScheduleCommand),
  Container.get(AddRostersCommand),
  Container.get(AddPlayoffProbCommand),
  Container.get(CalculateStandingsCommand),
  Container.get(CalculatePlayoffProbCommand)
]);

Container.get(ProcessingApp)
  .run()
  .then(exitCode => process.exit(exitCode));
