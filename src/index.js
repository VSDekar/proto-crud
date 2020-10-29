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
  console.log(options);
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
        isPrimaryKey: data.primary_key_column_name ? true : false,
      };
    });

    const table = {
      tableName: _.camelCase(tableName),
      columns,
    };
    return table;
  });

  console.log(tables[0].columns[0]);

  tables.forEach(table => {
    router.get(`/api/${table.tableName}/`, (req, res, next) =>
      handleGet(req, res, next, table),
    );

    router.get(`/api/${table.tableName}/:id`, (req, res, next) => {
      handleGetWithId(req, res, next, table);
    });

    router.post(`/api/${table.tableName}/`, (req, res, next) =>
      handlePost(req, res, next, table),
    );

    router.put(`/api/${table.tableName}`, (req, res, next) => {
      return res.send(req.body);
    });

    router.delete(`/api/${table.tableName}/:id`, (req, res, next) => {
      const id = parseInt(req.params.id);
      return res.send({ id });
    });
  });

  // console.log(tableNames);
  return router;
};

const handleGet = async (req, res, next, table) => {
  try {
    const snakeCaseTable = _.snakeCase(table.tableName);
    const sql = `Select * from ${snakeCaseTable}`;
    const dbResult = await db.query(sql);

    const result = dbResult.rows;

    res.send(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const handleGetWithId = async (req, res, next, table) => {
  const id = parseInt(req.params.id);
  return res.send({ id });
};

const handlePost = async (req, res, next, table) => {
  try {
    console.log(table);
    const snakeCaseTable = _.snakeCase(table.tableName);
    const columnsWithoutPrimaryKey = table.columns.filter(
      x => x.isPrimaryKey === false,
    );
    console.log(columnsWithoutPrimaryKey);
    const sql = `Insert Into ${snakeCaseTable}(${columnsWithoutPrimaryKey.map(
      x => x.columnName,
    )}) values (${columnsWithoutPrimaryKey.map(
      (x, i) => `\$${i + 1}`,
    )}) returning *`;

    console.log(sql);

    const dbResult = await db.query(sql, [
      ...columnsWithoutPrimaryKey.map(x => req.body[x.columnName]),
    ]);
    const result = dbResult.rows;

    res.send(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
