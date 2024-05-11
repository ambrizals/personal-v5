import { createEnv } from "@t3-oss/env-nuxt";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_KEY: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.number().default(3306),
    DATABASE_POOL_CONNECTION: z.number().default(1),
    NODE_ENV: z
      .enum(["development", "production"])
      .optional()
      .default("development"),
  },
  client: {
    NUXT_PUBLIC_CDN_ASSETS: z.string().optional(),
  },
});
