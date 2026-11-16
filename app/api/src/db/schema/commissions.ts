import { pgTable, pgEnum, uuid, numeric, smallint, timestamp, check, AnyPgColumn } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./user";
import { debt } from "./debt";
import { orders } from "./orders";

export const commissionTypeEnum = pgEnum('commission_type', [
  "REFERRAL_BONUS",
  "LEVEL_BONUS",
  "DEBT_DEDUCTION"
])

export const commissionStatusEnum = pgEnum('commission_status', [
  "PENDING",
  "CREDITED",
  "REVERSED",
])

export const commissions = pgTable('commissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  beneficiary_id: uuid('beneficiary_id').notNull().references(() => users.id),
  source_user_id: uuid('source_user_id').notNull().references(() => users.id),
  order_id: uuid('order_id').notNull().references(() => orders.id), // TODO: Add order id as references
  type: commissionTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  level: smallint('level'), // TODO: Add a check constraints later once merge everything
  debt_id: uuid('debt_id').references(() => debt.id), // TODO: Add debt id as references for later
  deducted_from_id: uuid('deducted_from_id').references((): AnyPgColumn => commissions.id), // TODO: Add commissions.id as references
  status: commissionStatusEnum('status').notNull().default("PENDING"),
  credited_at: timestamp('credited_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check('commission_level_check', sql`${table.level} BETWEEN 0 AND 5`)
])

export type Commissions = typeof commissions.$inferSelect;
export type NewCommissions = typeof commissions.$inferInsert;

