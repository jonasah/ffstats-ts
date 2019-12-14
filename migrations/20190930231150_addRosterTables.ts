import * as Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema
    .createTable('players', table => {
      table.increments('id');
      table
        .string('name')
        .notNullable()
        .unique();
      table.integer('position').notNullable();
    })
    .createTable('rosters', table => {
      table.increments('id');
      table.integer('year').notNullable();
      table.integer('week').notNullable();
      table
        .integer('team_id')
        .notNullable()
        .references('teams.id');
      table
        .integer('player_id')
        .notNullable()
        .references('players.id');
      table.integer('position').notNullable();
      table.float('points');
      table.boolean('is_bye_week').notNullable();
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('rosters').dropTable('players');
}
