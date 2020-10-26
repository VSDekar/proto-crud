select 
	c.* 
	, kcu.*
from information_schema.columns c
left join information_schema.key_column_usage kcu
	on c.table_name = kcu.table_name 
	and c.column_name = kcu.column_name
where c.table_schema = 'public' --order by table_name, ordinal_position

select 
	c.* 
from information_schema.columns c

select 
	tc.* 
from information_schema.table_constraints tc

select 
 kcu.*
from information_schema.key_column_usage kcu


--https://dataedo.com/kb/query/postgresql/list-all-primary-keys-and-their-columns

select kcu.table_schema,
       kcu.table_name,
       tco.constraint_name,
       kcu.ordinal_position as position,
       kcu.column_name as key_column
from information_schema.table_constraints tco
join information_schema.key_column_usage kcu 
     on kcu.constraint_name = tco.constraint_name
     and kcu.constraint_schema = tco.constraint_schema
     and kcu.constraint_name = tco.constraint_name
where tco.constraint_type = 'PRIMARY KEY'
order by kcu.table_schema,
         kcu.table_name,
         position;

