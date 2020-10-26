import express from 'express';
import _ from 'lodash';
import { setupDb } from './db/db.js';
import {
  selectAllMetadata,
  selectColumnsOfTable,
  selectTables,
} from './db/queries.js';

const router = express.Router();
let db = null;

router.get('/test', (req, res) => {
  res.send({ hello: 'world' });
});

export const initialize = async options => {
  db = setupDb(options.pgOptions);
  const metadata = (await db.query(selectAllMetadata)).rows;
  const tableNames = [...new Set(metadata.map(x => x.table_name))];

  const tables = tableNames.map(tableName => {
    const columnMetadata = metadata.filter(x => x.table_name === tableName);
    const columns = columnMetadata.map(data => {
      return {
        columnName: data.column_name,
        ordinalPosition: data.ordinal_position,
        isNullable: data.is_nullable,
        dataType: data.data_type,
        isIdentity: data.is_identity,
      };
    });

    const table = {
      tableName: _.camelCase(tableName),
      columns,
    };
    return table;
  });

  console.log(tables[0].columns[0]);

  // tableNames.forEach(table => {
  //   router.get(`/api/${table}/`, (req, res, next) =>
  //     handleGet(req, res, next, table),
  //   );

  //   router.post(`/api/${table}/`, (req, res, next) =>
  //     handlePost(req, res, next, table),
  //   );
  // });

  // console.log(tableNames);
  return router;
};

const handleGet = async (req, res, next, table) => {
  try {
    const snakeCaseTable = _.snakeCase(table);
    const sql = `Select * from ${snakeCaseTable}`;
    const dbResult = await db.query(sql);

    const result = dbResult.rows;

    res.send(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const handlePost = async (req, res, next, table) => {
  try {
    const snakeCaseTable = _.snakeCase(table);
    const sql = null;
  } catch (err) {
    console.error(err);
    next(err);
  }
};
