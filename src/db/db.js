import pg from 'pg';
const { Pool } = pg;
import _ from 'lodash';
import { selectTables } from './queries.js';
pg.types.setTypeParser(20, 'text', parseInt); // To parse bigint not as strings but as number

let pool = null;

export const setupDb = pgOptions => {
  pool = new Pool(pgOptions);
  return pool;
};
