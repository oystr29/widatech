import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { products as productsTable } from "~/db/schema.ts";
import { db } from "~/db/index.ts";
import { z } from "zod";

const products = new Hono();

products.get("/", async (c) => {
  const res = await db.query.products.findMany();

  return c.json({ data: res });
});

export const productSchema = z.object({
  name: z.string().min(1, "Please Insert Product Name"),
  picture: z
    .string()
    .default(
      "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081",
    ),
  stock: z.number().default(10),
  price: z.number().default(20000),
});

products.post("/", zValidator("form", productSchema.array()), async (c) => {
  const form = c.req.valid("form");

  await db.insert(productsTable).values(form);

  return c.json({});
});

export { products };
