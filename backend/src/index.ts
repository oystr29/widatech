import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { invoices } from "./routes/invoices.ts";
import { products } from "./routes/products.ts";
import { cors } from "hono/cors";

const app = new Hono();

app.use('/*', cors())

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/invoices", invoices);
app.route("/products", products);

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
