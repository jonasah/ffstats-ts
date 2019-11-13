import path from 'path';

export const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'ffstats-ts.sqlite3')
  },
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations'
  }
};
