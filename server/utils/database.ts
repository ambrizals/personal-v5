import Sequelize from "@sequelize/core";
import { env } from "~/env";

export const db = new Sequelize(
  env.DATABASE_NAME,
  env.DATABASE_USER,
  env.DATABASE_PASSWORD,
  {
    host: env.DATABASE_HOST,
    dialect: env.DATABASE_DIALECT,
    logging(sql, timing) {},
  }
);
