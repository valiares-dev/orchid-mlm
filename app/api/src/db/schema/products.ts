import { uuid, text, numeric, boolean, timestamp, pgTable } from "drizzle-orm/pg-core";

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  image_url: text('image_url'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Products = typeof products.$inferSelect;
export type NewProducts = typeof products.$inferInsert;

