import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { products as productsTable } from "../db/schema.js";
import { db } from "../db/index.js";
import { z } from "zod";

const products = new Hono();

products.get("/", async (c) => {
  const search = c.req.query("search");

  const res = await db.query.products.findMany({
    where: search
      ? (products, { like }) => like(products.name, `%${search}%`)
      : undefined,
  });

  return c.json({ data: res });
});

export const productSchema = z.object({
  name: z.string().min(1, "Please Insert Product Name"),
  picture: z
    .string()
    .default(
      "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081",
    ),
  qty: z.number(),
  price: z.number(),
});

products.post("/", zValidator("form", productSchema.array()), async (c) => {
  const form = c.req.valid("form");

  await db.insert(productsTable).values(form);

  return c.json({ message: "" });
});

export { products };
