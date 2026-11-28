import { pgTable, pgEnum, check, uuid, numeric, smallint, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./user";
import { orders } from "./orders";

export const debtStatusEnum = pgEnum('debt_status', [
  "OUTSTANDING",
  "PAID"
])

export const debt = pgTable('debt', {
  id: uuid('id').defaultRandom().primaryKey(),
  debtor_id: uuid('debtor_id').notNull().unique().references(() => users.id),
  creditor_id: uuid('creditor_id').notNull().references(() => users.id),
  order_id: uuid('order_id').notNull().references(() => orders.id),
  principal: numeric('principal', { precision: 12, scale: 2 }).notNull(),
  amount_paid: numeric('amount_paid', { precision: 12, scale: 2 }).notNull().default('0'),
  deduction_rate: smallint('deduction_rate').notNull().default(20),
  status: debtStatusEnum('status').notNull().default("OUTSTANDING"),
  settled_at: timestamp('settled_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  check('debt_principal_positive', sql`${t.principal} > 0`),
  check('debt_amount_paid_range', sql`${t.amount_paid} >= 0 AND ${t.amount_paid} <= ${t.principal}`),
  check('debt_rate_range', sql`${t.deduction_rate} BETWEEN 1 AND 100`),
  check('debt_not_self', sql`${t.debtor_id} <> ${t.creditor_id}`),
  check('debt_status_matches_paid', sql`(${t.status} = 'PAID') = (${t.amount_paid} = ${t.principal})`),
]);

export type Debt = typeof debt.$inferSelect;
export type NewDebt = typeof debt.$inferInsert;
