import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const Users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});

export type User = typeof Users.$inferSelect;
