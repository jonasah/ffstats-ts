import { Team } from '@ffstats/models';
import { CreateTableBuilder } from 'knex';

import { DbRepository } from './dbRepository';

const tableName = 'Teams';

export class TeamRepository extends DbRepository<Team> {
  constructor() {
    super(tableName);
  }

  protected createTableCallback(table: CreateTableBuilder) {
    table.increments('id');
    table.text('name').notNullable();
    table.text('owner');
  }

  protected getInsertData(team: Team) {
    return { Name: team.name, Owner: team.owner };
  }
}
