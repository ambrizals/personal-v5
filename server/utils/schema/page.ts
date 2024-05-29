import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const Page = mysqlTable("pages", {
  id: int("id").autoincrement().primaryKey(),
  uuid: varchar("uuid", { length: 150 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: text("slug").notNull(),
  content: text("content").default("").notNull(),
  published: boolean("published").default(false).notNull(),
  description: varchar("description", { length: 255 }).default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
