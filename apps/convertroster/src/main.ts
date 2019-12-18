import 'reflect-metadata';
import { Container } from 'typedi';
import { ConvertRosterApp } from './convertRosterApp';

// README: copy all "Full Box Score" into txt file and save in input folder,
// named YYYYwWW.txt (e.g. 2018w01.txt).

Container.get(ConvertRosterApp)
  .run()
  .then(exitCode => process.exit(exitCode));
