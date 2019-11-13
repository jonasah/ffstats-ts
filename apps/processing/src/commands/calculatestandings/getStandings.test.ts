import { Tiebreaker } from '@ffstats/models';
import { PlayoffStandings } from '../../utils/playoffStandings';
import { RegularSeasonStandings } from '../../utils/regularSeasonStandings';
import { getStandings } from './getStandings';

const year = 2018;
const regularSeasonLength = 13;
const playoffWeek = regularSeasonLength + 1;
const teamIds = [1, 2, 3, 4];

const mockDbContext: any = {
  seasonInfo: {
    select: jest.fn().mockResolvedValue({
      regular_season_length: regularSeasonLength,
      tiebreaker: Tiebreaker.Head2HeadRecords
    })
  },
  teams: {
    getTeamsInYear: jest.fn().mockResolvedValue(teamIds.map(id => ({ id })))
  },
  teamRecords: {
    getTeamRecordsByWeek: jest.fn().mockResolvedValue(
      teamIds.map(id => ({
        team_id: id
      }))
    )
  }
};

describe('getStandings', () => {
  it('should return default regular season standings for week 0', async () => {
    const standings = await getStandings(year, 0, mockDbContext);

    expect(standings instanceof RegularSeasonStandings).toBe(true);

    // each team should be represented
    expect(standings.teamRecords).toHaveLength(teamIds.length);
    expect(standings.teamRecords.every(tr => teamIds.includes(tr.team_id))).toBe(true);

    standings.teamRecords.forEach(tr => {
      expect(tr.year).toBe(year);
      expect(tr.week).toBe(0);
      expect(tr.rank).toBe(0);
      expect(tr.win).toBe(0);
      expect(tr.loss).toBe(0);
      expect(tr.points_for).toBe(0);
      expect(tr.points_against).toBe(0);
      expect(tr.is_playoffs).toBe(false);
      // own team should not be included as an opponent
      expect(tr.head2HeadRecords).toHaveLength(teamIds.length - 1);
      expect(tr.head2HeadRecords.map(h2h => h2h.opponent_id).includes(tr.team_id)).toBe(
        false
      );
    });
  });

  it('should return existing regular season team records for week > 0', async () => {
    const standings = await getStandings(year, regularSeasonLength, mockDbContext);

    expect(standings instanceof RegularSeasonStandings).toBe(true);

    // each team should be represented
    expect(standings.teamRecords).toHaveLength(teamIds.length);
    expect(standings.teamRecords.every(tr => teamIds.includes(tr.team_id))).toBe(true);
  });

  it('should return existing playoff team records', async () => {
    const standings = await getStandings(year, playoffWeek, mockDbContext);

    expect(standings instanceof PlayoffStandings).toBe(true);

    // each team should be represented
    expect(standings.teamRecords).toHaveLength(teamIds.length);
    expect(standings.teamRecords.every(tr => teamIds.includes(tr.team_id))).toBe(true);
  });
});
