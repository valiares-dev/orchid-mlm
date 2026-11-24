import { text, pgEnum, timestamp, uuid, pgTable, unique, index } from "drizzle-orm/pg-core";
import { users } from "./user";
import { packages } from "./packages";

export const codeStatusEnum = pgEnum("code_status", [
  "AVAILABLE",
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
  package_id: uuid('package_id').references(() => packages.id),
  status: codeStatusEnum('status').notNull().default("AVAILABLE"),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
},
  (t) => [unique('referral_codes_issued_by_type_unique').on(t.issued_by, t.type)]
);

export const referral_codes_uses = pgTable('referral_code_uses', {
  id: uuid('id').primaryKey().defaultRandom(),
  code_id: uuid('code_id').notNull().references(() => referral_code.id),
  user_id: uuid('user_id').notNull().unique().references(() => users.id),
  used_at: timestamp('used_at', { withTimezone: true }).notNull().defaultNow(),
},
  (t) => [index('referral_code_uses_code_id_idx').on(t.code_id)],
)

export type ReferralCode = typeof referral_code.$inferSelect;
export type NewReferralCode = typeof referral_code.$inferInsert

export type ReferralCodeUses = typeof referral_codes_uses.$inferSelect;
export type NewReferralCodeUses = typeof referral_codes_uses.$inferInsert;
