import { text, pgEnum, timestamp, uuid, pgTable } from "drizzle-orm/pg-core";
import { users } from "./user";
import { packages } from "./packages";

export const codeStatusEnum = pgEnum("code_status", [
  "AVAILABLE",
  "USED",
  "REVOKED"
]);

export const codeTypeEnum = pgEnum("code_type", [
  "SYSTEM",
  "DEDUCTION",
  "FULL"
]);

export const referral_code = pgTable('referral_codes', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  type: codeTypeEnum('type').notNull(),
  issued_by: uuid('issued_by').references(() => users.id),
  package_id: uuid('package_id').references(() => packages.id), // TO DO : Dont forget to add the package_id here
  status: codeStatusEnum('status').notNull().default("AVAILABLE"),
  used_by: uuid('used_by').references(() => users.id).unique(),
  used_at: timestamp('used_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ReferralCode = typeof referral_code.$inferSelect;
export type NewReferralCode = typeof referral_code.$inferInsert

