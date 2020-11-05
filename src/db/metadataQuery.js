export const metadataQuery = `select
c.table_catalog
, c.table_schema
, c.table_name
, c.column_name
, c.is_nullable
, c.data_type
, c.is_identity
, c.ordinal_position
, c.column_default
, pk.column_name as primary_key_column_name
, fk.foreign_table_name
, fk.foreign_column_name
, fk.constraint_name as foreign_key_constraint_name
, uq.column_name as unique_key_column_name
, uq.constraint_name as unique_constraint_name
, uq.ordinal_position as unique_key_ordinal_position
from information_schema.columns c
left join 
(SELECT kcu.table_schema,
    kcu.table_name,
    tco.constraint_name,
    kcu.ordinal_position,
    kcu.column_name
   FROM information_schema.table_constraints tco
     JOIN information_schema.key_column_usage kcu USING (constraint_name, constraint_schema)
  WHERE tco.constraint_type::text = 'PRIMARY KEY'::text) pk
using (table_name, column_name)
left join 
(SELECT kcc.table_schema,
    kcc.table_name,
    kcc.column_name,
    kcu.table_schema AS foreign_table_schema,
    kcu.table_name AS foreign_table_name,
    kcu.column_name AS foreign_column_name,
    rc.constraint_catalog,
    rc.constraint_schema,
    rc.constraint_name,
    rc.unique_constraint_catalog,
    rc.unique_constraint_schema,
    rc.unique_constraint_name,
    rc.match_option,
    rc.update_rule,
    rc.delete_rule
   FROM information_schema.referential_constraints rc
     JOIN information_schema.key_column_usage kcc USING (constraint_name, constraint_schema)
     JOIN information_schema.key_column_usage kcu ON kcu.ordinal_position::integer = kcc.position_in_unique_constraint::integer AND kcu.constraint_name::name = rc.unique_constraint_name::name
) fk
using (table_name, column_name)
left join 
(SELECT kcu.table_schema,
    kcu.table_name,
    tco.constraint_name,
    kcu.ordinal_position,
    kcu.column_name
   FROM information_schema.table_constraints tco
     JOIN information_schema.key_column_usage kcu USING (constraint_name, constraint_schema)
  WHERE tco.constraint_type::text = 'UNIQUE'::text) uq
using (table_name, column_name)
join information_schema.tables t 
using (table_name)
where c.table_schema = 'public' and t.table_type = 'BASE TABLE' -- maybe include here more than just base table
order by c.table_name, c.ordinal_position`;
