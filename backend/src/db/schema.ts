import { relations } from "drizzle-orm";
import {
  int,
  mysqlTable,
  primaryKey,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  invoice_no: varchar({ length: 255 }).notNull(),
  date: varchar({ length: 255 }).notNull(),
  customer_name: varchar({ length: 255 }).notNull(),
  sales_person_name: varchar({ length: 255 }).notNull(),
  payment_type: varchar({ length: 255 }).notNull(),
  notes: text(""),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  picture: varchar({ length: 255 }).notNull(),
  stock: int("stock"),
  price: int("price"),
  cogs: int("cogs"),
});

export const invoicesToProducts = mysqlTable("invoices_to_products", {
  id: int("id").autoincrement().primaryKey(),
  product_name: varchar({ length: 255 }).notNull(),
  product_picture: varchar({ length: 255 }).notNull(),
  qty: int("qty").notNull(),
  product_price: int("product_price").notNull(),
  invoiceId: int("invoice_id")
    .notNull()
    .references(() => invoices.id),
  productId: int("product_id")
    .notNull()
    .references(() => products.id),
});

export const invoicesRelations = relations(invoices, ({ many }) => ({
  invoicesToProducts: many(invoicesToProducts),
}));

export const invoicesToProductsRelations = relations(
  invoicesToProducts,
  ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoicesToProducts.invoiceId],
      references: [invoices.id],
    }),
    product: one(products, {
      fields: [invoicesToProducts.productId],
      references: [products.id],
    }),
  }),
);

export const productsRelations = relations(products, ({ many }) => ({
  invoicesToProducts: many(invoicesToProducts),
}));
