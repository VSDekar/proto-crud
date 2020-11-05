function defaultConvertResourceToTable(path: string) {
  return path.replace(/-/g, '_');
}

function defaultConvertTableToResource(table: string) {
  return table.replace(/_/g, '-');
}

function defaultConvertFieldToColumn(field: string) {
  return field.replace(/([a-z][A-Z])/g, function (g) {
    return g[0] + '_' + g[1].toLowerCase();
  });
}

function defaultConvertColumnToField(column: string) {
  return column.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}
