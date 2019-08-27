import { DbRepository } from './db-repository.interface';
import { DAO } from './dao';
import { Team } from '../models/team';

export class TeamRepository implements DbRepository<Team> {
  constructor(private readonly dao: DAO) {}

  public createTable() {
    this.dao.run(
      `CREATE TABLE IF NOT EXISTS Teams (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Owner TEXT NOT NULL)`
    );
  }

  public create(team: Team) {
    this.dao.run(
      'INSERT INTO Teams (Name, Owner) VALUES (?, ?)',
      team.name,
      team.owner
    );
  }

  public async get(id: number): Promise<Team> {
    return await this.dao
      .get('SELECT * FROM Teams WHERE Id = ?', id)
      .then(row => row as Team);
  }

  public async all(): Promise<Team[]> {
    return await this.dao
      .all('SELECT * FROM Teams')
      .then(rows => rows as Team[]);
  }
}
