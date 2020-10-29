import { metaDataQuery } from './metadataQuery.js';

export const selectAllMetadata = metaDataQuery;
export const selectTables =
  "select distinct table_name from information_schema.columns where table_schema = 'public'";
export const selectColumnsOfTable =
  "select * from information_schema.columns where table_schema = 'public' and table_name = $1";
