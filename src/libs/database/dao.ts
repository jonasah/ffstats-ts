import * as sqlite3 from 'sqlite3';

export class DAO {
  private db: sqlite3.Database;

  constructor(dbFilePath: string) {
    this.db = new sqlite3.Database(dbFilePath);
  }

  public run(sql: string, ...params: any[]): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (res: sqlite3.RunResult, err: Error) => {
        if (err) {
          console.log('Error running sql: ' + sql + '. Params: ' + params);
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public get(sql: string, ...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.log('Error running sql: ' + sql + '. Params: ' + params);
          console.log(err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  public all(sql: string, ...params: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log('Error running sql: ' + sql + '. Params: ' + params);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}
