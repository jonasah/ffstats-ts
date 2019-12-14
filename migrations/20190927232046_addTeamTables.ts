import * as Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema
    .createTable('teams', table => {
      table.increments('id');
      table
        .string('owner')
        .notNullable()
        .unique();
    })
    .createTable('team_names', table => {
      table.increments('id');
      table
        .integer('team_id')
        .notNullable()
        .references('teams.id');
      table.integer('year').notNullable();
      table.string('name').notNullable();
      table.unique(['team_id', 'year']);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('teams').dropTable('team_names');
}
