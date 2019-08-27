import { DAO } from './dao';

const dbObject = {
  n: 42,
  t: 'stringValue'
};

describe('DAO', () => {
  let dao: DAO;

  beforeAll(() => {
    dao = new DAO(':memory:');
  });

  describe('create table', () => {
    it('should succeed', async () => {
      await dao.run('CREATE TABLE Test (n INTEGER, t TEXT)');
    });
  });
  describe('insert data', () => {
    it('should succeed', async () => {
      await dao.run(
        'INSERT INTO Test (n, t) VALUES (?, ?)',
        dbObject.n,
        dbObject.t
      );
    });
  });
  describe('select single row', () => {
    it('should return object', async () => {
      const object = await dao.get(
        'SELECT * FROM Test WHERE n = ?',
        dbObject.n
      );
      expect(object).toEqual(dbObject);
    });
  });
  describe('select multiple rows', () => {
    it('should return one row', async () => {
      const rows = await dao.all('SELECT * FROM Test');
      expect(rows.length).toBe(1);
    });
  });
});
