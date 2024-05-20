import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { and, eq, like, sql } from "drizzle-orm";
import { format } from "date-fns";
import { TRPCError } from "@trpc/server";
import { cachedComments } from "~/server/utils/cache/blog";
import {
  authorizedProcedure,
  preAuthorizedProcedure,
} from "../procedure/authorized";
import { formatToSlug } from "~/server/utils/string";

export default router({
  article: publicProcedure
    .input(
      z.object({
        perPage: z.number().default(15),
        page: z.number().default(1),
        terms: z.string().default(""),
        showHidden: z.boolean().default(false),
      })
    )
    .query(async ({ input }) => {
      const whereQuery = and(
        input.showHidden ? undefined : eq(Article.published, true),
        input.terms.length > 0
          ? like(Article.title, `%${input.terms}%`)
          : undefined
      );

      const pagination = await db
        .select({
          count: sql<number>`count(id)`,
        })
        .from(Article)
        .where(whereQuery)
        .then((res) => ({
          current: input.page,
          last_page: Math.ceil(res[0].count / input.perPage),
          total_item: res[0].count,
          offset: input.perPage * (input.page - 1),
        }));

      const article = await db.query.Article.findMany({
        where: whereQuery,
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
  read: preAuthorizedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const post = await db.query.Article.findFirst({
        where: (fields, { eq }) => eq(fields.slug, input),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      if (ctx.user === null && post.published === false) {
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
  create: authorizedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        isPublished: z.boolean(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const slug = formatToSlug(input.title);

      const data = await db
        .insert(Article)
        .values({
          slug,
          title: input.title,
          content: input.content,
          description: input.description,
          published: input.isPublished,
        })
        .then((res) =>
          res[0].affectedRows > 0
            ? db.query.Article.findFirst({
                where: (fields, { eq }) => eq(fields.slug, slug),
              })
            : undefined
        );

      if (data === undefined) {
        throw new TRPCError({
          message: "Something happen",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return data;
    }),
  update: authorizedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        isPublished: z.boolean().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const data = await db.query.Article.findFirst({
        where: (fields, { eq }) => eq(fields.id, input.id),
      });

      if (data === undefined) {
        throw new TRPCError({
          message: "Article not found",
          code: "NOT_FOUND",
        });
      }

      const update = await db
        .update(Article)
        .set({
          title: input.title,
          description: input.description,
          published: input.isPublished,
          content: input.content,
        })
        .where(eq(Article.id, input.id));

      if (update[0].affectedRows > 0) {
        return true;
      } else {
        throw new TRPCError({
          message: "Server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  destroy: authorizedProcedure.input(z.number()).mutation(async ({ input }) => {
    const flag = await db.delete(Article).where(eq(Article.id, input));

    if (flag[0].affectedRows > 0) {
      return true;
    } else {
      throw new TRPCError({
        message: "Article not found",
        code: "NOT_FOUND",
      });
    }
  }),
});
