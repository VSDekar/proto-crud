export const selectAllMetadata =
  "select * from information_schema.columns where table_schema = 'public' order by table_name, ordinal_position";
export const selectTables =
  "select distinct table_name from information_schema.columns where table_schema = 'public'";
export const selectColumnsOfTable =
  "select * from information_schema.columns where table_schema = 'public' and table_name = $1";
