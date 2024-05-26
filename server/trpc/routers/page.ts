import { z } from "zod";
import { router } from "../trpc";
import {
  authorizedProcedure,
  preAuthorizedProcedure,
} from "../procedure/authorized";
import { v4 as uuid } from "uuid";
import { Page } from "~/server/utils/schema";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export default router({
  list: authorizedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        perPage: z.number().default(15),
      })
    )
    .query(async ({ input }) => {
      const pagination = await db
        .select({
          count: sql<number>`count(id)`,
        })
        .from(Page)
        .then((res) => ({
          current: input.page,
          last_page: Math.ceil(res[0].count / input.perPage),
          total_item: res[0].count,
          offset: input.perPage * (input.page - 1),
        }));

      const pages = await db.query.Page.findMany({
        limit: input.perPage,
        offset: pagination.offset,
        orderBy: (fields, { desc }) => desc(fields.createdAt),
      });

      return {
        pages,
        pagination: {
          page: pagination.current,
          perPage: input.perPage,
          lastPage: pagination.last_page,
          totalItem: pagination.total_item,
        },
      };
    }),
  entry: preAuthorizedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const page = await db.query.Page.findFirst({
        where: (fields, { or, eq, and }) =>
          and(
            or(eq(fields.slug, input), eq(fields.uuid, input)),
            ctx.user ? undefined : eq(fields.published, true)
          ),
      });

      if (page === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }

      return {
        ...page,
        id: ctx.user ? page?.id : null,
      };
    }),
  create: authorizedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        isPublished: z.boolean(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = uuid();
      const result = await db
        .insert(Page)
        .values({
          title: input.title,
          slug: formatToSlug(input.title),
          uuid: id,
          content: input.content,
          published: input.isPublished,
          description: input.description,
        })
        .then(async (res) => {
          if (res[0].affectedRows > 0) {
            const result = await db.query.Page.findFirst({
              where: (fields, { eq }) => eq(fields.uuid, id),
            });
            return result;
          } else {
            return undefined;
          }
        });

      return result;
    }),
  update: authorizedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        isPublished: z.boolean().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(Page)
        .set({
          title: input.title,
          slug: input.title ? formatToSlug(input.title) : undefined,
          content: input.content,
          published: input.isPublished,
          description: input.description,
        })
        .then(async (res) => {
          if (res[0].affectedRows > 0) {
            const result = await db.query.Page.findFirst({
              where: (fields, { eq }) => eq(fields.id, input.id),
            });
            return result;
          } else {
            if (res[0].affectedRows === 0) {
              throw createError({
                statusCode: 404,
                statusMessage: "Article not found",
              });
            }
            throw createError({
              statusCode: 422,
              statusMessage: "Something wrong",
            });
          }
        });

      return result;
    }),
});
