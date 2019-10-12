import { Service } from 'typedi';
import { GameRepository } from './gameRepository';
import { GameScoreRepository } from './gameScoreRepository';
import { PlayerRepository } from './playerRepository';
import { RosterRepository } from './rosterRepository';
import { SeasonInfoRepository } from './seasonInfoRepository';
import { TeamNameRepository } from './teamNameRepository';
import { TeamRepository } from './teamRepository';

@Service()
export class DbContext {
  constructor(
    public readonly gameScores: GameScoreRepository,
    public readonly games: GameRepository,
    public readonly players: PlayerRepository,
    public readonly rosters: RosterRepository,
    public readonly seasonInfo: SeasonInfoRepository,
    public readonly teamNames: TeamNameRepository,
    public readonly teams: TeamRepository
  ) {}
}
