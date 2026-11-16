import { text, uuid, numeric, boolean, timestamp, smallint, pgTable } from "drizzle-orm/pg-core";
import { products } from "./products";

export const packages = pgTable('packages', {
  id: uuid('id').defaultRandom().unique().notNull().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  is_starter: boolean('is_starter').default(false).notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const package_items = pgTable('package_items', {
  package_id: uuid('package_id').notNull().references(() => packages.id),
  product_id: uuid('product_id').notNull().references(() => products.id), // TODO : Don't forget to add the product_id as foreign key
  quantity: smallint('quantity').notNull().default(1),
})

// packages type
export type Packages = typeof packages.$inferSelect;
export type NewPackages = typeof packages.$inferInsert;

// packages_items types 
export type PackageItems = typeof package_items.$inferSelect;
export type NewPackageItems = typeof package_items.$inferInsert;

