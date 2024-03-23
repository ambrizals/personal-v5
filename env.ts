import { createEnv } from "@t3-oss/env-nuxt";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_KEY: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_DIALECT: z.enum([
      "mysql",
      "postgres",
      "sqlite",
      "mariadb",
      "mssql",
      "mariadb",
      "mssql",
      "db2",
      "snowflake",
      "ibmi",
    ]),
    NODE_ENV: z
      .enum(["development", "production"])
      .optional()
      .default("development"),
  },
});
