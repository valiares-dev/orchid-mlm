## Schema per each database

- schema contains each schema/tables have a seperate files for easy to read
- refer to drizzle kit documentation like datatypes and more
- when updating a specific table run the command `pnpm drizzle-kit generate` & `pnpm drizzle-kit migrate` to update the table on the database
- connection of index.ts on the same this directory same as this readme is a connection of the db to the schema
- be aware of the 2 tables at one files like rates.ts
