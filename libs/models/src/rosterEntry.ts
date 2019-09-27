import { Position } from './enums/position';

export interface RosterEntry {
  Id: number;
  Year: number;
  Week: number;
  TeamId: number;
  PlayerId: number;
  Position: Position;
  Points?: number;
  IsByeWeek: boolean;
}
