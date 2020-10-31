import { query } from './db/db.js';
import {
  filterOutPrimaryKeyColumns,
  getIdFromParams,
  filterForPrimaryKey,
} from './helpers.js';
import _ from 'lodash';

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {Table} table
 */
export const handleGet = async (req, res, next, table) => {
  try {
    const sql = `Select * from ${table.tableName}`;
    const result = await query(sql);

    res.send(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {Table} table
 */
export const handleGetWithId = async (
  req,
  res,
  next,
  { tableName, columns },
) => {
  try {
    const id = getIdFromParams(req);
    const primaryKey = filterForPrimaryKey(columns)[0];

    const sql = `Select * from ${tableName} where ${primaryKey.columnName} = $1`;
    const result = await query(sql, [id]);

    const row = result[0];

    return res.send(row);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const handlePost = async (req, res, next, { tableName, columns }) => {
  try {
    const columnsWithoutPrimaryKey = filterOutPrimaryKeyColumns(columns);

    const sql = `Insert Into ${tableName}(${columnsWithoutPrimaryKey.map(
      x => x.columnName,
    )}) values (${columnsWithoutPrimaryKey.map(
      (x, i) => `\$${i + 1}`,
    )}) returning *`;

    console.log(sql);

    const result = await query(sql, [
      ...columnsWithoutPrimaryKey.map(x => req.body[_.camelCase(x.columnName)]),
    ]);

    res.send(result[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {Table} table
 */
export const handlePut = async (req, res, next, { tableName, columns }) => {
  try {
    const primaryKeyColumn = filterForPrimaryKey(columns)[0];
    const columnsWithoutPrimaryKey = filterOutPrimaryKeyColumns(columns);
    const body = req.body;
    let lastIndex = 0;

    const sql = `Update ${tableName} set ${columnsWithoutPrimaryKey.map(
      (x, i) => {
        lastIndex = i + 1;
        return `${x.columnName} = \$${i + 1}`;
      },
    )} where ${primaryKeyColumn.columnName} = \$${lastIndex + 1} returning *`;

    const paramArray = [
      ...columnsWithoutPrimaryKey.map(x => body[_.camelCase(x.columnName)]),
      body[_.camelCase(primaryKeyColumn.columnName)],
    ];

    const result = await query(sql, paramArray);

    const row = result[0];

    return res.send(row);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {Table} table
 */
export const handleDelete = async (req, res, next, { tableName, columns }) => {
  try {
    const id = getIdFromParams(req);
    const primaryKey = filterForPrimaryKey(columns)[0];

    const sql = `Delete From ${tableName} where ${primaryKey.columnName} = $1 returning *`;

    const result = await query(sql, [id]);
    return res.send(result);
  } catch (err) {
    next(err);
  }
};
