import { db } from "./index.ts";
import { products } from "./schema.ts";

async function main() {
  const res = await db.insert(products).values([
    {
      name: "Bluetooth Speaker",
      picture: "http://localhost:3001/imgs/bluetooth-speaker.jpg",
      price: 756000,
      stock: 50,
      cogs: 630000,
    },
    {
      name: "Headphone",
      picture: "http://localhost:3001/imgs/headphone.webp",
      price: 480000,
      cogs: 400000,
      stock: 50,
    },
    {
      name: "Laptop Charger",
      picture: "http://localhost:3001/imgs/laptop-charger.jpg",
      price: 960000,
      cogs: 800000,
      stock: 50,
    },
    {
      name: "LCD Monitor",
      picture: "http://localhost:3001/imgs/lcd-monitor.webp",
      cogs: 500000,
      price: 600000,
      stock: 10,
    },
  ]);
  console.log("Done Seeder");
  console.log(res);
}

await main().catch((e) => console.error(e));
