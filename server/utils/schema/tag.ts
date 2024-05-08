import { relations } from "drizzle-orm";
import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";
import { TagArticle } from "./tag_article";

export const Tag = mysqlTable("tags", {
  id: int("id", { unsigned: true }).autoincrement().primaryKey(),
  label: varchar("label", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const TagRelations = relations(Tag, ({ many }) => ({
  tagArticle: many(TagArticle, {
    relationName: "tag_article",
  }),
}));
