import { Team } from '@ffstats/models';
import { CreateTableBuilder } from 'knex';

import { DbRepository } from './db-repository';

const tableName = 'Teams';

export class TeamRepository extends DbRepository<Team> {
  constructor() {
    super(tableName);
  }

  protected createTableCallback(table: CreateTableBuilder) {
    table.increments('Id');
    table.text('Name').notNullable();
    table.text('Owner');
  }

  protected getInsertData(team: Team) {
    return { Name: team.Name, Owner: team.Owner };
  }
}
