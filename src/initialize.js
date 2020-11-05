import express from 'express';
import _ from 'lodash';
import { query } from './db/db.js';
import { metadataQuery } from './db/metadataQuery.js';
import {
  handleGet,
  handleGetWithId,
  handlePost,
  handlePut,
  handleDelete,
} from './routerHandlers.js';
import debug from 'debug';
const routesDebug = debug('proto-crud:routes');

const router = express.Router();

export const initialize = async () => {
  const metadata = await query(metadataQuery);
  const tableNames = [...new Set(metadata.map(x => x.tableName))];
  routesDebug(tableNames);

  const tables = tableNames.map(tableName => {
    const columnMetadata = metadata.filter(x => x.tableName === tableName);
    const columns = columnMetadata.map(data => {
      return {
        columnName: data.columnName,
        ordinalPosition: data.ordinalPosition,
        isNullable: data.isNullable,
        dataType: data.dataType,
        isIdentity: data.isIdentity,
        isPrimaryKey: data.primaryKeyColumnName ? true : false,
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
    const apiPath = `/api/${table.camelTableName}/`;
    const apiPathWithId = `${apiPath}:id`;

    router.get(apiPath, (req, res, next) => handleGet(req, res, next, table));

    router.get(apiPathWithId, (req, res, next) =>
      handleGetWithId(req, res, next, table),
    );

    router.post(apiPath, (req, res, next) => handlePost(req, res, next, table));

    router.put(apiPath, (req, res, next) => handlePut(req, res, next, table));

    router.delete(apiPathWithId, (req, res, next) =>
      handleDelete(req, res, next, table),
    );
  });

  return router;
};
