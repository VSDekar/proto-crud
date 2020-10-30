import pg from 'pg';
const { Pool } = pg;
import _ from 'lodash';
import { selectTables } from './queries.js';
pg.types.setTypeParser(20, 'text', parseInt); // To parse bigint not as strings but as number

/**
 * @type {pg.Pool}
 */
// @ts-ignore
export let db = null;

export const setupDb = pgOptions => {
  db = new Pool(pgOptions);
  return db;
};
