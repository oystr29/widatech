import dayjs from "dayjs";
import { db } from "./index.js";
import { invoices, invoicesToProducts, products } from "./schema.js";
import { faker } from "@faker-js/faker";

/* const invoicesSeed = () => {
  const data: (typeof invoices.$inferSelect)[] = Array.from(
    { length: 50 },
    (_, i) => {
      const products: (typeof invoicesToProducts.$inferInsert)[] = Array.from(
        {
          length: faker.number.int({ min: 1, max: 4 }),
        },
        () => {
          return {};
        },
      );
      const date = faker.date.between({
        from: dayjs().subtract(2, "month").toDate(),
        to: dayjs().add(1, "week").toDate(),
      });
      return {
        date: date.toISOString(),
        customer_name: faker.person.firstName,
        invoice_no: `Invoice#${date.getTime()}`,
      };
    },
  );

  const res = await db.insert(invoices).values();
}; */

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
