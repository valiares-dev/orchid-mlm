import { sql } from 'drizzle-orm';
import { uuid, smallint, check, pgTable } from 'drizzle-orm/pg-core';
import { users } from './user';

export const network_closure = pgTable(
  'network_closure',
  {
    ancestor_id: uuid('ancestor_id').references(() => users.id),
    descendant_id: uuid('descendant_id').references(() => users.id),
    depth: smallint('depth').notNull(),
  },
  (table) => [
    check('depth_check', sql`${table.depth} >= 0 AND ${table.depth} <= 5`),
  ]
);

export type NetworkClosure = typeof network_closure.$inferSelect;
export type NewNetworkClosure = typeof network_closure.$inferInsert;

