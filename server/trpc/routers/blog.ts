import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { eq, sql } from "drizzle-orm";
import { format } from "date-fns";
import { TRPCError } from "@trpc/server";
import { cachedComments } from "~/server/utils/cache/blog";

export default router({
  article: publicProcedure
    .input(
      z.object({
        perPage: z.number().default(15),
        page: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      const pagination = await db
        .select({
          count: sql<number>`count(id)`,
        })
        .from(Article)
        .where(eq(Article.published, true))
        .then((res) => ({
          current: input.page,
          last_page: Math.ceil(res[0].count / input.perPage),
          total_item: res[0].count,
          offset: input.perPage * (input.page - 1),
        }));

      const article = await db.query.Article.findMany({
        where: (fields, { eq }) => eq(fields.published, true),
        limit: input.perPage,
        offset: pagination.offset,
        orderBy: (fields, { desc }) => desc(fields.createdAt),
      });

      return {
        article: article.map((data) => ({
          ...data,
          createdAt: format(data.createdAt, "dd MMM, yyyy"),
          description: data.description ?? "-",
        })),
        pagination: {
          current: pagination.current,
          last_page: pagination.last_page,
          total_item: pagination.total_item,
          per_page: input.perPage,
        },
      };
    }),
  read: publicProcedure.input(z.string()).query(async ({ input }) => {
    const post = await db.query.Article.findFirst({
      where: (fields, { eq }) => eq(fields.slug, input),
    });

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Article not found",
      });
    }

    return {
      ...post,
      createdAt: format(post.createdAt, "dd MMM, yyyy"),
    };
  }),
  comments: publicProcedure.query(async () => {
    const response = await cachedComments();

    return response.response
      .filter((_, i) => i < 5)
      .map((d) => ({
        name: d.author.name,
        message: d.raw_message,
        id: d.id,
      }));
  }),
});
