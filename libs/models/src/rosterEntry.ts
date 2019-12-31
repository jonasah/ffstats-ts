import { Player } from '@ffstats/models';
import { Position } from './enums/position';

export interface RosterEntry {
  year: number;
  week: number;
  teamId: number;
  playerId: number;
  position: Position;
  points: number;
  isByeWeek: boolean;

  Player?: Player;
}
