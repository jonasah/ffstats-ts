import { TeamName } from './teamName';

export interface Team {
  id: number;
  owner: string;

  teamNames: TeamName[];
}
