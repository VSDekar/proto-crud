import pg from 'pg';
const { Pool } = pg;
import _ from 'lodash';

pg.types.setTypeParser(20, 'text', parseInt); // To parse bigint not as strings but as number

/**
 * @type {pg.Pool | null}
 */
export let db = null;

export const setupDb = pgOptions => {
  db = new Pool(pgOptions);
  return db;
};

export const query = async (sql, params) => {
  console.log(`Query: ${sql}`);
  console.log(`Params: ${params}`);

  if (db) {
    const dbResult = await db.query(sql, params);
    const result = transformResultSet(dbResult);

    return result;
  } else {
    throw Error('Database not initialized');
  }
};

const transformResultSet = res => {
  if (res.rowCount > 0) {
    return res.rows.map(row => {
      const d = {};
      Object.keys(row).forEach(k => {
        d[_.camelCase(k)] = row[k];
      });
      return d;
    });
  } else {
    return [];
  }
};
