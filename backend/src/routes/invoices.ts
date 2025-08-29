import { Hono } from "hono";
import { db } from "../db/index.js";
import dayjs from "dayjs";
import {
  invoices as invoicesTable,
  invoicesToProducts as invoicesToProductsTable,
} from "../db/schema.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { productSchema } from "./products.js";
import { count, sql } from "drizzle-orm";
import { datetime } from "drizzle-orm/mysql-core";

const invoices = new Hono();

const defaultPage = 1;
const defaultPaginate = 10;

invoices.get("/", async (c) => {
  const page = !Number.isNaN(c.req.query("page"))
    ? Number(c.req.query("page") ?? `${defaultPage}`)
    : defaultPage;
  const paginate = !Number.isNaN(c.req.query("paginate"))
    ? Number(c.req.query("paginate") ?? `${defaultPaginate}`)
    : defaultPaginate;

  const offset = (page - 1) * paginate;

  const [{ count: total_page }] = await db
    .select({ count: count() })
    .from(invoicesTable);

  const lastPage = Math.ceil(total_page / paginate);

  const data = await db.query.invoices.findMany({
    with: { invoicesToProducts: true },
    limit: paginate,
    offset,
  });

  return c.json({
    data,
    meta: {
      current_page: page,
      from: offset + 1,
      last_page: lastPage,
      per_page: paginate,
      to: Math.min(offset + paginate, total_page),
      total: total_page,
      links: Array.from({ length: lastPage }, (_, i) => {
        const pageNum = i + 1;
        return {
          label: pageNum,
          active: pageNum === page,
        };
      }),
    },
  });
});

invoices.get("/timeseries", async (c) => {
  const type = c.req.query("type");

  const invoices = await db.query.invoices.findMany({
    orderBy: (invoice, { asc }) => {
      return [asc(invoice.date)];
    },
    where:
      type === "weekly" || type === "monthly"
        ? (invoice, { between }) => {
            const endDate = new Date();

            const startDate =
              type === "monthly"
                ? dayjs().subtract(1, "month")
                : dayjs().subtract(1, "week");

            return between(
              invoice.date,
              startDate.toISOString(),
              endDate.toISOString(),
            );
          }
        : undefined,
  });

  const dataRecord: Record<string, number> = {};

  invoices.forEach((invoice, i) => {
    const d = new Date(invoice.date);
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    if (!dataRecord[date]) {
      dataRecord[date] = 0;
    }
    dataRecord[date] += invoice.order_total;
  });

  const data: { x: number; y: number }[] = [];

  Object.keys(dataRecord).forEach((d) => {
    data.push({ x: Number(d), y: dataRecord[d] });
  });

  return c.json({ data });
});

invoices.get("/:id", async (c) => {
  const { id } = c.req.param();

  try {
    const query = await db.execute(
      sql.raw(`SELECT 
    i.id, 
    i.invoice_no, 
    i.date, 
    i.customer_name, 
    i.sales_person_name, 
    i.payment_type, 
    i.notes,
    COALESCE(
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', itp.id,
                    'product_name', itp.product_name,
                    'product_picture', itp.product_picture,
                    'qty', itp.qty,
                    'product_price', itp.product_price,
                    'invoiceId', itp.invoice_id,
                    'productId', itp.product_id,
                    'product', (
                        SELECT JSON_OBJECT(
                            'id', p.id,
                            'name', p.name,
                            'picture', p.picture,
                            'stock', p.stock,
                            'price', p.price,
                            'cogs', p.cogs
                        )
                        FROM products p
                        WHERE p.id = itp.product_id
                        LIMIT 1
                    )
                )
            )
            FROM invoices_to_products itp
            WHERE itp.invoice_id = i.id
        ),
        JSON_ARRAY()
    ) AS invoicesToProducts
FROM invoices i
WHERE i.id = ${id}
LIMIT 1;`),
    );
    const data = (
      query[0] as unknown as (typeof invoicesTable.$inferSelect & {
        invoicesToProducts: string;
      })[]
    )[0];

    const invoicesToProducts = JSON.parse(
      data.invoicesToProducts,
    ) as (typeof invoicesToProductsTable.$inferSelect)[];

    const summary = {
      total: invoicesToProducts.reduce(
        (a, b) => a + b.qty * b.product_price,
        0,
      ),
    };

    return c.json({
      data: {
        date: data.date,
        id: data.id,
        invoice_no: data.invoice_no,
        customer_name: data.customer_name,
        sales_person_name: data.sales_person_name,
        payment_type: data.payment_type,
        notes: data.notes,
        invoicesToProducts,
        summary,
      },
    });
  } catch (e) {
    console.error(e);
    return c.json(
      {
        message: "Error",
      },
      400,
    );
  }
});

invoices.get("/:id/products", async (c) => {
  const { id } = c.req.param();

  const invoice = await db.query.invoices.findFirst({
    where: (invoices, { eq }) => eq(invoices.id, Number(id)),
    with: { invoicesToProducts: true },
  });

  const summary = {
    total: invoice?.invoicesToProducts.reduce(
      (a, b) => a + b.qty * b.product_price,
      0,
    ),
  };

  return c.json({ data: { ...invoice, summary } });
});

invoices.post(
  "/",
  zValidator(
    "json",
    z.object({
      date: z.iso.datetime(),
      customer_name: z.string().min(1, "Please Fill the Customer Name"),
      sales_person_name: z.string().min(1, "Please fill the Sales Person Name"),
      notes: z.string().optional(),
      products: productSchema
        .extend({
          product_id: z.number(),
        })
        .array(),
      payment_type: z.string().nullable(),
    }),
  ),
  async (c) => {
    const { products, ...invoice } = c.req.valid("json");

    try {
      const t = new Date();
      const date = new Date(invoice.date);
      const dateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        t.getHours(),
        t.getMinutes(),
        t.getSeconds(),
        t.getMilliseconds(),
      );
      const invoice_no = `Invoice#${date.getTime()}`;

      const [invoiceRes] = await db.insert(invoicesTable).values({
        ...invoice,
        invoice_no,
        date: invoice.date,
        order_total: products.reduce((a, b) => a + b.qty * b.price, 0),
        payment_type: !!invoice.payment_type
          ? invoice.payment_type
          : "NotCashOrCredit",
      });

      const productsWithInvoiceId = products.map((product) => ({
        ...product,
        product_picture: product.picture,
        product_name: product.name,
        product_price: product.price,
        productId: product.product_id,
        invoiceId: invoiceRes.insertId,
      }));

      await db.insert(invoicesToProductsTable).values(productsWithInvoiceId);
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
