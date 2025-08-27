import "dotenv/config";
import * as schema from "./schema.ts";
import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(process.env.DATABASE_URL!, { schema, mode: "planetscale" });

export { db };
