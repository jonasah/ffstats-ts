import * as Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('playoff_probabilities', table => {
    table.increments('id');
    table.integer('year').notNullable();
    table.integer('week').notNullable();
    table
      .integer('team_id')
      .notNullable()
      .references('teams.id');
    table.float('including_tiebreaker').notNullable();
    table.float('excluding_tiebreaker').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('playoff_probabilities');
}
