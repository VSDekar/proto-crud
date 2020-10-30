/**
 * @param {Column[]} columns
 */
export const filterOutPrimaryKeyColumns = columns => {
  return columns.filter(x => !x.isPrimaryKey);
};

/**
 * @param {Column[]} columns
 */
export const filterForPrimaryKey = columns => {
  return columns.filter(x => x.isPrimaryKey);
};

export const getIdFromParams = req => {
  return parseInt(req.params.id);
};
