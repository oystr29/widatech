import { relations } from "drizzle-orm";
import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar({ length: 255 }).notNull(),
  customer_name: varchar({ length: 255 }).notNull(),
  sales_person_name: varchar({ length: 255 }).notNull(),
  notes: text(""),
});

export const invoicesproducts = mysqlTable("invoices_products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  picture: varchar({ length: 255 }).notNull(),
  qty: int("qty"),
  price: int("price"),
  invoiceId: int("invoice_id"),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  picture: varchar({ length: 255 }).notNull(),
  stock: int("stock"),
  price: int("price"),
});

export const invoicesRelations = relations(invoices, ({ many, one }) => ({
  invoicesproducts: many(invoicesproducts),
}));

export const invoicesproductsRelations = relations(
  invoicesproducts,
  ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoicesproducts.invoiceId],
      references: [invoices.id],
    }),
  }),
);
