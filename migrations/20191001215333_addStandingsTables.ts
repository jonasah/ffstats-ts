import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('team_records', table => {
      table.increments('id');
      table.integer('year').notNullable();
      table.integer('week').notNullable();
      table
        .integer('team_id')
        .notNullable()
        .references('teams.id');
      table.integer('rank').notNullable();
      table.integer('win').notNullable();
      table.integer('loss').notNullable();
      table.float('points_for').notNullable();
      table.float('points_against').notNullable();
      table.boolean('is_playoffs').notNullable();
      table.unique(['year', 'week', 'team_id']);
    })
    .createTable('head2head_records', table => {
      table.increments('id');
      table.integer('year').notNullable();
      table.integer('week').notNullable();
      table
        .integer('team_id')
        .notNullable()
        .references('teams.id');
      table
        .integer('opponent_id')
        .notNullable()
        .references('teams.id');
      table.integer('win').notNullable();
      table.integer('loss').notNullable();
      table
        .integer('team_record_id')
        .notNullable()
        .references('team_records.id');
      table.unique(['year', 'week', 'team_id', 'opponent_id']);
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('head2head_records').dropTable('team_records');
}
