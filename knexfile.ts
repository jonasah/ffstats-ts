module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './ffstats-ts.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
