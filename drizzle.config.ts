import { defineConfig } from "drizzle-kit";
import { env } from "./env";

export default defineConfig({
  schema: "./server/utils/schema/index.ts",
  driver: "mysql2",
  dbCredentials: {
    database: env.DATABASE_NAME,
    host: env.DATABASE_HOST,
    password: env.DATABASE_PASSWORD,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
  },
  verbose: true,
  strict: true,
  out: "migrations",
});
