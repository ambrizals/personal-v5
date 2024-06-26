import { relations } from "drizzle-orm";
import {
  int,
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { TagArticle } from "./tag_article";

export const Article = mysqlTable("articles", {
  id: int("id", {
    unsigned: true,
  })
    .autoincrement()
    .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content").default(""),
  cover: varchar("cover", { length: 255 }),
  thumbnail: varchar("thumbnail", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  published: boolean("published").notNull().default(false),
});

export const ArticleRelations = relations(Article, ({ many }) => ({
  tagArticle: many(TagArticle, {
    relationName: "tag_articles",
  }),
}));
