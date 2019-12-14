import * as Knex from 'knex';
import { Tiebreaker } from '../libs/models/src/enums/tiebreaker';
import { SeasonInfo } from '../libs/models/src/seasonInfo';

export async function up(knex: Knex) {
  await knex.schema.alterTable('season_info', table => {
    table
      .integer('tiebreaker')
      .notNullable()
      .defaultTo(Tiebreaker.PointsFor);
  });

  return (
    knex<SeasonInfo>('season_info')
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      .where('year', '<=', 2018)
      .update({ tiebreaker: Tiebreaker.Head2HeadRecords })
  );
}

export async function down(knex: Knex) {
  return knex.schema.alterTable('season_info', table => {
    table.dropColumn('tiebreaker');
  });
}
