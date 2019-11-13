import { Service } from 'typedi';
import { GameRepository } from './gameRepository';
import { GameScoreRepository } from './gameScoreRepository';
import { Head2HeadRecordRepository } from './head2headRecordRepository';
import { PlayerRepository } from './playerRepository';
import { PlayoffProbabilityRepository } from './playoffProbabilityRepository';
import { RosterRepository } from './rosterRepository';
import { SeasonInfoRepository } from './seasonInfoRepository';
import { TeamNameRepository } from './teamNameRepository';
import { TeamRecordRepository } from './teamRecordRepository';
import { TeamRepository } from './teamRepository';

@Service()
export class DbContext {
  constructor(
    public readonly games: GameRepository,
    public readonly gameScores: GameScoreRepository,
    public readonly head2HeadRecords: Head2HeadRecordRepository,
    public readonly players: PlayerRepository,
    public readonly playoffProbability: PlayoffProbabilityRepository,
    public readonly rosters: RosterRepository,
    public readonly seasonInfo: SeasonInfoRepository,
    public readonly teamNames: TeamNameRepository,
    public readonly teamRecords: TeamRecordRepository,
    public readonly teams: TeamRepository
  ) {}
}
