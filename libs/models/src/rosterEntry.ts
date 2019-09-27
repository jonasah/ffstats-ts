import { Position } from './enums/position';

export interface RosterEntry {
  id: number;
  year: number;
  week: number;
  teamId: number;
  playerId: number;
  position: Position;
  points?: number;
  isByeWeek: boolean;
}
