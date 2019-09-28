import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('games', table => {
      table.increments('id');
      table.integer('year').notNullable();
      table.integer('week').notNullable();
    })
    .createTable('game_scores', table => {
      table.increments('id');
      table.integer('year').notNullable();
      table.integer('week').notNullable();
      table
        .integer('team_id')
        .notNullable()
        .references('teams.id');
      table.float('points');
      table
        .integer('game_id')
        .notNullable()
        .references('games.id');
      table.unique(['year', 'week', 'team_id']);
    })
    .createTable('season_info', table => {
      table.increments('id');
      table
        .integer('year')
        .notNullable()
        .unique();
      table.integer('num_teams').notNullable();
      table.integer('num_playoff_teams').notNullable();
      table.integer('regular_season_length').notNullable();
      table.integer('playoff_length').notNullable();
      table.integer('champion_id').references('teams.id');
      table.integer('second_place_id').references('teams.id');
      table.integer('third_place_id').references('teams.id');
      table.integer('sacko_id').references('teams.id');
      table.integer('regular_season_champion_id').references('teams.id');
      table.integer('highest_points_for_team_id').references('teams.id');
      table
        .float('highest_points_for')
        .notNullable()
        .defaultTo(0);
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTable('games')
    .dropTable('game_scores')
    .dropTable('season_info');
}
