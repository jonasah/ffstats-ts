import 'reflect-metadata';
import { Container } from 'typedi';
import { AddPlayoffProbCommand } from './commands/addplayoffprob/addPlayoffProbCommand';
import { AddRostersCommand } from './commands/addrosters/addRostersCommand';
import { AddSeasonCommand } from './commands/addseason/addSeasonCommand';
import { CalculatePlayoffProbCommand } from './commands/calculateplayoffprob/calculatePlayoffProbCommand';
import { CalculateStandingsCommand } from './commands/calculatestandings/calculateStandingsCommand';
import { commandsToken, ProcessingApp } from './processingApp';

Container.set(commandsToken, [
  Container.get(AddSeasonCommand),
  Container.get(AddRostersCommand),
  Container.get(AddPlayoffProbCommand),
  Container.get(CalculateStandingsCommand),
  Container.get(CalculatePlayoffProbCommand)
]);

Container.get(ProcessingApp)
  .run()
  .then(exitCode => process.exit(exitCode));
