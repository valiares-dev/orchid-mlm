import { pgTable, pgEnum, check, uuid, numeric, smallint, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { sql } from "drizzle-orm";

export const debtStatusEnum = pgEnum('debt_status', [
  "OUTSTANDING",
  "PAID"
])

export const debt = pgTable('debt', {
  id: uuid('id').defaultRandom().unique().primaryKey(),
  debtor_id: uuid('debtor_id').unique().notNull().references(() => users.id),
  creditor_id: uuid('creditor_id').notNull().references(() => users.id),
  order_id: uuid('order_id').notNull(), // TODO: Add the order id as references
  principal: numeric('principal', { precision: 12, scale: 2 }).notNull(),
  amount_paid: numeric('amount_paid', { precision: 12, scale: 2 }),
  deduction_rate: smallint('deduction_rate').notNull().default(0),
  status: debtStatusEnum('status').notNull().default("OUTSTANDING"),
  settled_at: timestamp('settled_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  check('debt_check', sql``) // TODO: Add the check for later
});

export type Debt = typeof debt.$inferSelect;
export type NewDebt = typeof debt.$inferInsert;
