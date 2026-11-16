import { pgTable, pgEnum, uuid, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { users } from "./user";

export const withdrawalStatusEnum = pgEnum('withdrawal_status', [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "PAID"
])

export const withdrawal = pgTable('withdrawal', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  status: withdrawalStatusEnum('status').default("PENDING").notNull(),
  processed_by: uuid('processed_by').references(() => users.id),
  processed_at: timestamp('processed_at', { withTimezone: true }),
  remarks: text('remarks'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export type Withdrawal = typeof withdrawal.$inferSelect;
export type NewWithdrawal = typeof withdrawal.$inferInsert;

