import pg from 'pg';
const { Pool } = pg;
import _ from 'lodash';
import debug from 'debug';

const sqlDebugQuery = debug('proto-crud:sql-query');
const sqlDebugQueryParams = debug('proto-crud:sql-params');
const sqlDebugResult = debug('proto-crud:sql-result');

pg.types.setTypeParser(20, 'text', parseInt); // To parse bigint not as strings but as number

export let db = new Pool({
  host: process.env.postgresHost,
  user: process.env.postgresUser,
  port: process.env.postgresPort,
  password: process.env.postgresPassword,
  database: process.env.postgresDatabase,
  min: process.env.postgresPoolMin,
  max: process.env.postgresPoolMax,
});

/**
 * @param {string | pg.QueryArrayConfig<any>} sql
 * @param {any[] | undefined} [params]
 */
export const query = async (sql, params) => {
  sqlDebugQuery(`Query: ${sql}`);
  sqlDebugQueryParams(`Params: ${params}`);

  if (db) {
    const dbResult = await db.query(sql, params);
    const result = transformResultSet(dbResult);

    sqlDebugResult(result);

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
