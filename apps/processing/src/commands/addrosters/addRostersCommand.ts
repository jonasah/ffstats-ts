import { DbContext } from '@ffstats/database';
import { Logger } from '@ffstats/logger';
import { Player, Position, RosterEntry } from '@ffstats/models';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import { Service } from 'typedi';
import { WeekRosters } from '../../models/rosters';
import { ICommand } from '../command.interface';

// key: player position, value: list of valid roster positions
const validRosterPositions = new Map([
  [Position.QB, [Position.QB, Position.BN, Position.RES]],
  [Position.RB, [Position.RB, Position.FLX, Position.BN, Position.RES]],
  [Position.WR, [Position.WR, Position.FLX, Position.BN, Position.RES]],
  [Position.TE, [Position.TE, Position.BN, Position.RES]],
  [Position.K, [Position.K, Position.BN, Position.RES]],
  [Position.DEF, [Position.DEF, Position.BN]]
]);

@Service()
export class AddRostersCommand implements ICommand {
  public readonly name = 'add-rosters';

  private files: string[];
  private directories: string[];

  constructor(private readonly dbContext: DbContext, private readonly logger: Logger) {}

  public parseArguments(args: string[]): void {
    const definitions: commandLineArgs.OptionDefinition[] = [
      {
        name: 'file',
        alias: 'f',
        multiple: true
      },
      {
        name: 'directory',
        alias: 'd',
        multiple: true
      }
    ];

    const options = commandLineArgs(definitions, {
      argv: args || []
    });

    this.files = options.file || [];
    this.directories = options.directory || [];

    if (this.files.length === 0 && this.directories.length === 0) {
      this.logger.warn('No roster files or directories specified');
    }
  }

  public async run(): Promise<void> {
    for (const file of this.files) {
      await this.addFromFile(file);
    }

    for (const directory of this.directories) {
      await this.addFromDirectory(directory);
    }
  }

  private async addFromFile(file: string, force?: boolean): Promise<void> {
    this.logger.info(`Adding rosters from: ${file}`);

    const rosters = JSON.parse(fs.readFileSync(file, 'utf-8')) as WeekRosters;

    const weekExists = await this.dbContext.rosters.weekExists(
      rosters.year,
      rosters.week
    );

    if (weekExists) {
      if (force) {
        await this.dbContext.rosters.delete({ year: rosters.year, week: rosters.week });
      } else {
        return;
      }
    }

    const players = new Map(
      (await this.dbContext.players.select()).map(p => [p.name, p])
    );

    for (const roster of rosters.rosters) {
      this.logger.info(` Adding roster for ${roster.team}`);

      const team = await this.dbContext.teams.select({ owner: roster.team }, true);
      const teamRosterEntries: Partial<RosterEntry>[] = [];

      for (const entry of roster.entries) {
        if (!players.has(entry.playerName)) {
          const newPlayer: Pick<Player, 'name' | 'position'> = {
            name: entry.playerName,
            position: Position[entry.playerPosition]
          };

          players.set(newPlayer.name, {
            id: await this.dbContext.players.insert(newPlayer),
            ...newPlayer
          });
        }

        const player = players.get(entry.playerName);

        if (player.position !== Position[entry.playerPosition]) {
          this.logger.warn(
            `Position mismatch for ${player.name} in ${rosters.year} w${rosters.week}: ${player.position} != ${entry.playerPosition}`
          );
        }

        teamRosterEntries.push({
          year: rosters.year,
          week: rosters.week,
          team_id: team.id,
          player_id: player.id,
          position: Position[entry.rosterPosition],
          points: entry.points,
          is_bye_week: entry.isByeWeek || false
        });
      }

      this.validateRoster(teamRosterEntries);

      await this.dbContext.rosters.insert(teamRosterEntries);
    }

    await this.calculateGameScores(rosters.year, rosters.week);
  }

  private async addFromDirectory(directory: string, force?: boolean): Promise<void> {
    const dirFiles = fs.readdirSync(directory).filter(file => file.endsWith('.json'));

    for (const file of dirFiles) {
      await this.addFromFile(file, force);
    }
  }

  private validateRoster(roster: Partial<RosterEntry>[]) {
    // TODO: fix, Player is not set
    // this.validateRosterPositions(roster);

    this.validateNumStartersAtPosition(roster, Position.QB, 1);
    this.validateNumStartersAtPosition(roster, Position.RB, 2);
    this.validateNumStartersAtPosition(roster, Position.WR, 2);
    this.validateNumStartersAtPosition(roster, Position.TE, 1);
    this.validateNumStartersAtPosition(roster, Position.FLX, 1);
    this.validateNumStartersAtPosition(roster, Position.K, 1);
    this.validateNumStartersAtPosition(roster, Position.DEF, 1);
  }

  private validateNumStartersAtPosition(
    roster: Partial<RosterEntry>[],
    position: Position,
    numStartersAtPosition: 1 | 2
  ) {
    const numEntries = roster.filter(re => re.position === position).length;

    if (numEntries > numStartersAtPosition) {
      throw new Error(`Too many starters at ${Position[position]}: ${numEntries}`);
    }

    if (numEntries < numStartersAtPosition) {
      this.logger.warn(
        `Too few starters at ${Position[position]}: ${numEntries} (this might not be an error)`
      );
    }
  }

  private validateRosterPositions(roster: Partial<RosterEntry>[]) {
    roster.forEach(entry => {
      if (!validRosterPositions.get(entry.Player.position).includes(entry.position)) {
        throw new Error(
          `Invalid roster position for ${entry.Player.name} (${entry.Player.position}): ${entry.position}`
        );
      }
    });
  }

  private async calculateGameScores(year: number, week: number): Promise<void> {
    this.logger.info(`Calculating game scores for ${year} week ${week}`);

    const totalPointsPerTeam = await this.dbContext.rosters.getTotalPointsPerTeam(
      year,
      week
    );

    for (const teamPoints of totalPointsPerTeam) {
      await this.dbContext.gameScores.updatePoints(
        year,
        week,
        teamPoints.teamId,
        teamPoints.points
      );
    }
  }
}
