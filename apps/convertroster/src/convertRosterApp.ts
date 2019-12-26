import { Logger } from '@ffstats/logger';
import { Position, Team } from '@ffstats/models';
import fs from 'fs';
import path from 'path';
import { Service } from 'typedi';
import { knex } from '../../../libs/database/src/knexInstance';
import { IApp } from '../../common';
import { RosterEntry, WeekRosters } from '../../processing/src/models/rosters';
import { FileIterator, LineIterator } from './iterators';

const inputRosterPositions: string[] = [
  'QB',
  'RB',
  'WR',
  'TE',
  'K',
  'DEF',
  'W/R',
  'BN',
  'RES'
];

export type OutputRosterPosition = keyof typeof Position;

@Service()
export class ConvertRosterApp implements IApp {
  constructor(private readonly logger: Logger) {}

  public async run(): Promise<number> {
    const inputDirectory = path.join(__dirname, '..', 'input');
    const outputDirectory = path.join(__dirname, '..', 'output');

    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    const inputFilePaths = fs
      .readdirSync(inputDirectory)
      .filter(fileName => path.extname(fileName) === '.txt')
      .map(fileName => path.join(inputDirectory, fileName));

    await Promise.all(
      inputFilePaths.map(filePath =>
        this.parseFile(filePath).then(weekRosters =>
          this.writeOutputFile(weekRosters, outputDirectory)
        )
      )
    );

    return 0;
  }

  private async parseFile(filePath: string): Promise<WeekRosters> {
    this.logger.info(`Parsing: ${filePath}`);

    // extract year and week from file name
    const fileName = path.basename(filePath, '.txt');
    const fileNameMatch = /(\d{4})-?w(\d{1,2})/.exec(fileName);
    const year = parseInt(fileNameMatch[1], 10);
    const week = parseInt(fileNameMatch[2], 10);

    const weekRosters: WeekRosters = {
      year,
      week,
      rosters: []
    };

    const teamOwnerMap = await this.getTeamsAndOwners(year);

    const it = new FileIterator(filePath);

    let line = it.nextLine();

    while (line != null) {
      if (teamOwnerMap.has(line)) {
        // line is team name
        weekRosters.rosters.push({
          team: teamOwnerMap.get(line), // look up owner
          entries: []
        });
      } else if (inputRosterPositions.includes(line)) {
        const outputRosterPosition = line === 'W/R' ? 'FLX' : line;
        const entry = parseRosterEntry(outputRosterPosition as OutputRosterPosition, it);

        if (entry == null) {
          continue;
        }

        // fix names for relocated teams
        if (entry.playerName === 'Los Angeles Rams' && year < 2016) {
          entry.playerName = 'St. Louis Rams';
        } else if (entry.playerName === 'Los Angeles Chargers' && year < 2017) {
          entry.playerName = 'San Diego Chargers';
        }

        weekRosters.rosters[weekRosters.rosters.length - 1].entries.push(entry);
      }

      line = it.nextLine();
    }

    return weekRosters;
  }

  private writeOutputFile(weekRosters: WeekRosters, outputDirectory: string) {
    const outputPath = path.join(
      outputDirectory,
      `rosters-${weekRosters.year}w${weekRosters.week}.json`
    );

    this.logger.info(`Writing: ${outputPath}`);

    fs.writeFileSync(outputPath, JSON.stringify(weekRosters, null, 2));
  }

  private async getTeamsAndOwners(year: number): Promise<Map<string, string>> {
    return knex<Team>('teams')
      .join('team_names', {
        'teams.id': 'team_names.team_id'
      })
      .where({ 'team_names.year': year })
      .select(['teams.owner', 'team_names.name'])
      .then(teams => new Map(teams.map(t => [t.name, t.owner])));
  }
}

export function parseRosterEntry(
  position: OutputRosterPosition,
  it: LineIterator
): RosterEntry {
  const entry: RosterEntry = {
    playerName: 'TBA',
    playerPosition: 'RES', // placeholder, must be valid value
    rosterPosition: position,
    isByeWeek: false
  };

  const playerLine = it.nextLine();

  if (playerLine.includes('--empty--')) {
    return undefined;
  }

  if (playerLine.endsWith('View Videos')) {
    const opponentLine = it.nextLine();

    if (opponentLine.includes('Bye')) {
      entry.isByeWeek = true;
      // status and stat line is on opponent line
    } else {
      // skip status and stat lines
      it.nextLine();
      it.nextLine();
    }
  } else if (playerLine.includes('Bye')) {
    entry.isByeWeek = true;
    // status and stat line is on player line
  } else {
    // skip status and stat lines
    it.nextLine();
    it.nextLine();
  }

  // extract player name and position from player line
  // (assume player name ends with lowercase character)
  const playerMatch = /([A-Za-z0-9' .-]+(?:[a-z]|III))([A-Z]{1,3})(?:\s|View)/.exec(
    playerLine
  );
  entry.playerName = playerMatch[1];
  entry.playerPosition = playerMatch[2] as OutputRosterPosition;

  // parse points line
  const pointsLine = it.nextLine();
  entry.points = parseFloat(pointsLine);

  return entry;
}
