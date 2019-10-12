import * as Knex from 'knex';
import { Tiebreaker } from '../libs/models/src/enums/tiebreaker';
import { SeasonInfo } from '../libs/models/src/seasonInfo';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable('season_info', table => {
    table
      .integer('tiebreaker')
      .notNullable()
      .defaultTo(Tiebreaker.PointsFor);
  });

  return knex<SeasonInfo>('season_info')
    .where('year', '<=', 2018)
    .update({ tiebreaker: Tiebreaker.Head2HeadRecords });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('season_info', table => {
    table.dropColumn('tiebreaker');
  });
}
