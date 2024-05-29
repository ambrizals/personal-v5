import { env } from "~/env/server";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: env.DATABASE_HOST,
  database: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  pool: env.DATABASE_POOL_CONNECTION,
  port: env.DATABASE_PORT,
});

export const db = drizzle(connection, {
  schema: {
    Users,
    Article,
    ArticleRelations,
    Tag,
    TagRelations,
    TagArticle,
    TagArticleRelations,
    Page,
  },
  mode: "default",
});
