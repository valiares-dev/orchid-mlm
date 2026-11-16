import { pgTable, smallint, numeric, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// level rates table 
export const level_rates = pgTable('level_rates', {
  level: smallint('level').primaryKey(),// TODO: add check between 1 - 5
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  check('level_check', sql`${table.level} BETWEEN 0 AND 5`)
])

// direct rates table
export const direct_rates = pgTable('direct_rates', {
  from_sale: smallint('from_sale').primaryKey(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// types for level rates 
export type LevelRates = typeof level_rates.$inferSelect;
export type NewLevelRates = typeof level_rates.$inferInsert;

// types for direct rates 
export type DirectRates = typeof direct_rates.$inferSelect;
export type NewDirectRates = typeof direct_rates.$inferInsert;

