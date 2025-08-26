import { relations } from "drizzle-orm";
import {
  date,
  int,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const invoicesTable = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  date: date("date", { mode: "string" }).notNull(),
  customer_name: varchar({ length: 255 }).notNull(),
  sales_person_name: varchar({ length: 255 }).notNull(),
  notes: text(""),
});

export const invoicesRelations = relations(invoicesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const productsTable = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  picture: varchar({ length: 255 }).notNull(),
  stock: int("stock"),
  price: int("price"),
  invoiceId: int('invoice_id')
});

export const productsRelations = relations(productsTable, ({ one }) => ({
  invoice: one(invoicesTable, {
    fields: [productsTable.invoiceId],
    references: [invoicesTable.id],
  }),
}));
