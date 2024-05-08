import { mysqlTable, varchar, int, text } from "drizzle-orm/mysql-core";

export const Users = mysqlTable("users", {
  id: int("id", {
    unsigned: true,
  })
    .primaryKey()
    .autoincrement()
    .notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: text("password").notNull(),
});

export type User = typeof Users.$inferSelect;
