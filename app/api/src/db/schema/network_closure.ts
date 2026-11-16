import { sql } from 'drizzle-orm';
import { uuid, smallint, check, pgTable, primaryKey, index } from 'drizzle-orm/pg-core';
import { users } from './user';

export const network_closure = pgTable(
  'network_closure',
  {
    ancestor_id: uuid('ancestor_id').notNull().references(() => users.id),
    descendant_id: uuid('descendant_id').notNull().references(() => users.id),
    depth: smallint('depth').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.ancestor_id, table.descendant_id] }),
    index('network_closure_descendant_idx').on(table.descendant_id),
    check('depth_check', sql`${table.depth} >= 0 AND ${table.depth} <= 5`),
  ]
);

export type NetworkClosure = typeof network_closure.$inferSelect;
export type NewNetworkClosure = typeof network_closure.$inferInsert;

