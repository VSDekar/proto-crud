select 
	c.* 
	, kcu.*
from information_schema.columns c
left join information_schema.key_column_usage kcu
	on c.table_name = kcu.table_name 
	and c.column_name = kcu.column_name
where c.table_schema = 'public' --order by table_name, ordinal_position

---------- This is the Query of the Queries

select
	c.table_catalog
	, c.table_schema
	, c.table_name
	, c.column_name
	, c.ordinal_position
	, c.column_default
	, c.is_nullable
	, c.data_type
	, c.is_identity
	, c.identity_start
	, c.identity_increment
	, keys.*
from information_schema.columns c
left join (
	Select
		kcu.constraint_catalog
		, kcu.constraint_schema
		, kcu.table_catalog as constraint_table_catalog
		, kcu.table_schema as constraint_table_schema
		, kcu.table_name as constraint_table_name
		, kcu.column_name as constraint_column_name

		, tc.constraint_type

		, ccu.table_name as foreign_table_name
		, ccu.column_name as foreign_table_column
		, ccu.constraint_name
	From information_schema.key_column_usage kcu
	inner join information_schema.table_constraints tc
		on kcu.table_name = tc.table_name
		and kcu.constraint_name = tc.constraint_name
		and kcu.constraint_schema = tc.constraint_schema
	left join information_schema.constraint_column_usage ccu
		on kcu.constraint_name = ccu.constraint_name
		and tc.constraint_type = 'FOREIGN KEY'
	) keys 
	on c.table_name = keys.constraint_table_name
	and c.column_name = keys.constraint_column_name
where c.table_schema = 'public'
order by c.table_name


select 
	c.* 
from information_schema.columns c

select 
	tc.* 
from information_schema.table_constraints tc

select 
 kcu.*
from information_schema.key_column_usage kcu

select
	ccu.*
from information_schema.constraint_column_usage ccu


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

