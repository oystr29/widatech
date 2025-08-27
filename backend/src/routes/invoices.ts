import { Hono } from "hono";
import { db } from "../db/index.ts";
import { invoicesproducts, invoices as invoicesTable } from "../db/schema.ts";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { productSchema } from "./products.ts";

const invoices = new Hono();

invoices.get("/", async (c) => {
  const data = await db.query.invoices.findMany({
    with: { invoicesproducts: true },
  });

  return c.json({ data });
});

invoices.get("/:id", async (c) => {
  const { id } = c.req.param();

  const data = await db.query.invoices.findFirst({
    where: (invoices, { eq }) => eq(invoices.id, Number(id)),
    with: { invoicesproducts: true },
  });

  return c.json({ data });
});

invoices.get("/:id/products", async (c) => {
  const { id } = c.req.param();

  const data = await db.query.invoicesproducts.findMany({
    where: (invoices, { eq }) => eq(invoices.invoiceId, Number(id)),
  });

  return c.json({ data });
});

invoices.post(
  "/",
  zValidator(
    "json",
    z.object({
      date: z.iso.date(),
      customer_name: z.string().min(1, "Please Fill the Customer Name"),
      sales_person_name: z.string().min(1, "Please fill the Sales Person Name"),
      notes: z.string().optional(),
      products: productSchema.array(),
    }),
  ),
  async (c) => {
    const { products, ...invoice } = c.req.valid("json");

    try {
      const [invoiceRes] = await db.insert(invoicesTable).values(invoice);

      const productsWithInvoiceId = products.map((product) => ({
        ...product,
        invoiceId: invoiceRes.insertId,
      }));

      await db.insert(invoicesproducts).values(productsWithInvoiceId);
      return c.json({
        message: "Success insert Invoices",
      });
    } catch (e) {
      console.error(e);
      return c.json(
        {
          message: "Failed to insert Invoices",
        },
        500,
      );
    }
  },
);

export { invoices };
