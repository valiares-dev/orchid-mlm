import { pgTable, pgEnum, uuid, numeric, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const orderAcquisitionEnum = pgEnum('order_acquisition', [
  "PURCHASED",
  "CREDIT"
])

export const orderStatusEnum = pgEnum('order_status', [
  "PENDING",
  "PAID",
  "CANCELLED"
])

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  buyer_id: uuid('buyer_id').notNull().references(() => users.id),
  referrer_id: uuid('referrer_id').notNull().references(() => users.id),
  package_id: uuid('package_id').notNull(), // TODO: Add package id as references
  acquisition: orderAcquisitionEnum('acquisition').notNull().default("PURCHASED"),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  status: orderStatusEnum('status').notNull().default("PENDING"),
  confirmed_by: uuid("confirmed_by").references(() => users.id),
  paid_at: timestamp("paid_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export type Orders = typeof orders.$inferSelect;
export type NewOrders = typeof orders.$inferInsert;

