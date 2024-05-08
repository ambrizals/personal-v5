import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { Article } from "./article";
import { Tag } from "./tag";
import { relations } from "drizzle-orm";

export const TagArticle = mysqlTable("tag_articles", {
  id: int("id", {
    unsigned: true,
  })
    .notNull()
    .autoincrement()
    .primaryKey(),
  articleId: int("article_id", { unsigned: true })
    .references(() => Article.id)
    .notNull(),
  tagId: int("tag_id", { unsigned: true }).references(() => Tag.id),
});

export const TagArticleRelations = relations(TagArticle, ({ one }) => ({
  article: one(Article, {
    fields: [TagArticle.articleId],
    references: [Article.id],
  }),
  tag: one(Tag, {
    fields: [TagArticle.id],
    references: [Tag.id],
  }),
}));
