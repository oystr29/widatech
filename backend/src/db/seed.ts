import { db } from "./index.ts";
import { products } from "./schema.ts";

async function main() {
  const res = await db.insert(products).values([
    {
      name: "Hermes",
      picture:
        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png?v=1530129113",
      price: 30000000,
      stock: 2,
    },
    {
      name: "New Balance",
      picture:
        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-2_large.png?v=1530129132",
      price: 50000000,
      stock: 3,
    },
    {
      name: "Montblanc",
      picture:
        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-3_large.png?v=1530129152",
      price: 10000000,
      stock: 4,
    },
    {
      name: "New Era",
      picture:
        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-4_large.png?v=1530129177",
      price: 500000,
      stock: 1,
    },
  ]);
  console.log("Done Seeder");
  console.log(res);
}

await main().catch((e) => console.error(e));
