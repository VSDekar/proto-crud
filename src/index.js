import express from 'express';
import _ from 'lodash';
import { db, setupDb } from './db/db.js';
import {
  selectAllMetadata,
  selectColumnsOfTable,
  selectTables,
} from './db/queries.js';
import {
  filterForPrimaryKey,
  filterOutPrimaryKeyColumns,
  getIdFromParams,
} from './helpers.js';
import {
  handleGet,
  handleGetWithId,
  handlePost,
  handlePut,
  handleDelete,
} from './routerHandlers.js';

const router = express.Router();

router.get('/test', (req, res) => {
  res.send({ hello: 'world' });
});

export const initialize = async options => {
  setupDb(options.pgOptions);
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
      tableName: tableName,
      camelTableName: _.camelCase(tableName),
      columns,
    };
    return table;
  });

  tables.forEach(table => {
    router.get(`/api/${table.camelTableName}/`, (req, res, next) =>
      handleGet(req, res, next, table),
    );

    router.get(`/api/${table.camelTableName}/:id`, (req, res, next) => {
      handleGetWithId(req, res, next, table);
    });

    router.post(`/api/${table.camelTableName}/`, (req, res, next) =>
      handlePost(req, res, next, table),
    );

    router.put(`/api/${table.camelTableName}`, (req, res, next) => {
      handlePut(req, res, next, table);
    });

    router.delete(`/api/${table.camelTableName}/:id`, (req, res, next) => {
      handleDelete(req, res, next, table);
    });
  });

  return router;
};
