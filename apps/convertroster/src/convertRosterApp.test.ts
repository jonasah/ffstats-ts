import { RosterEntry } from '../../processing/src/models/rosters';
import { OutputRosterPosition, parseRosterEntry } from './convertRosterApp';
import { StringIterator } from './iterators';

describe('convertRosterApp', () => {
  const testCases: ReadonlyArray<[string, OutputRosterPosition, RosterEntry]> = [
    [
      'Lamar JacksonQB - BAL	NYJ\nWin, 42-21\n212	5	-	86	-	-	-	-	-	-	-	-\n37.08',
      'QB',
      {
        playerName: 'Lamar Jackson',
        playerPosition: 'QB',
        rosterPosition: 'QB',
        points: 37.08,
        isByeWeek: false
      }
    ],
    [
      'Robert Griffin IIIQB - BAL	NYJ\nWin, 42-21\n-	-	-	6	-	-	-	-	-	-	-	-\n0.60',
      'BN',
      {
        playerName: 'Robert Griffin III',
        playerPosition: 'QB',
        rosterPosition: 'BN',
        points: 0.6,
        isByeWeek: false
      }
    ],
    [
      'Dalvin CookRB - MINQView Videos\n@LAC\nWin, 39-10\n-	-	-	27	-	3	16	-	-	-	-	-\n5.80',
      'RB',
      {
        playerName: 'Dalvin Cook',
        playerPosition: 'RB',
        rosterPosition: 'RB',
        points: 5.8,
        isByeWeek: false
      }
    ]
  ];

  test.each(testCases)('parseRosterEntry() #%#', (input, position, expected) => {
    const entry = parseRosterEntry(position, new StringIterator(input));
    expect(entry).toEqual(expected);
  });
});
