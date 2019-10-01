import { Player } from '@ffstats/models';
import { Position } from './enums/position';

export interface RosterEntry {
  id: number;
  year: number;
  week: number;
  team_id: number;
  player_id: number;
  position: Position;
  points?: number;
  is_bye_week: boolean;

  Player?: Player;
}
