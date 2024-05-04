import { env } from "~/env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connection = mysql.createPool({
  host: env.DATABASE_HOST,
  database: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  pool: 1,
  port: 3306,
});

export const db = drizzle(connection, {
  schema,
  mode: "default",
});
