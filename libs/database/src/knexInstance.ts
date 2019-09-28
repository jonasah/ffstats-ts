// tslint:disable-next-line: import-name
import Knex from 'knex';
import path from 'path';

export const knex = Knex({
  client: 'sqlite3',
  connection: {
    // TODO: use dotenv
    filename: path.join(__dirname, '..', '..', '..', 'ffstats-ts.sqlite3')
  },
  useNullAsDefault: true
});
