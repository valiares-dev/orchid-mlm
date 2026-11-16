import { pgTable, pgEnum, uuid, numeric, smallint, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

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
  source_user_id: uuid('uuid').notNull().references(() => users.id),
  order_id: uuid('order_id').notNull(), // TODO: Add order id as references
  type: commissionTypeEnum('commission_type').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  level: smallint('level'), // TODO: Add a check constraints later once merge everything
  debt_id: uuid('debt_id'), // TODO: Add debt id as references for later
  deducted_from_id: uuid('deducted_from_id'), // TODO: Add commissions.id as references
  status: commissionStatusEnum('status').default("PENDING"),
  credited_at: timestamp('credited_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export type Commissions = typeof commissions.$inferSelect;
export type NewCommissions = typeof commissions.$inferInsert;

