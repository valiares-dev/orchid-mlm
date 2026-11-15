import { pgEnum, pgTable, text, timestamp, uuid, boolean, type AnyPgColumn } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', [
  "MEMBER",
  "ADMIN",
  "DEV",
])

export const accountStatusEnum = pgEnum('account_status', [
  "INACTIVE",
  "ACTIVE_DEDUCTION",
  "ACTIVE_FULL"
])

export const users = pgTable("users", {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  phone: text('phone'),
  role: userRoleEnum('role').default("MEMBER").notNull(),
  account_status: accountStatusEnum().default('INACTIVE').notNull(),
  sponsor_id: uuid('sponsor_id').references((): AnyPgColumn => users.id),
  terms_accepted_at: timestamp('terms_accepted_at', { withTimezone: true }).notNull(),
  activated_at: timestamp('activated_at', { withTimezone: true }),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;


