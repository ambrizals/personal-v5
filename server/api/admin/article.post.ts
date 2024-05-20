import { z } from "zod";

export default defineEventHandler(async (event) => {
  const body = await readFormData(event);
  const payload: Record<string, any> = {};
  body.forEach((value, key) => (payload[key] = value));

  const rules = z.object({
    title: z.string(),
    content: z.string(),
    description: z.string(),
    isPublished: z
      .custom<string>()
      .transform((published) => {
        if (published !== undefined) {
          return Boolean(published);
        }
        return published;
      })
      .refine((value) => value !== undefined, {
        message: "Is published is required",
      }),
    cover: z
      .custom<File>()
      .optional()
      .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
        message: "Only images is allowed",
      }),
  });

  const form = rules.safeParse(payload);

  if (form.success === false) {
    throw createError({
      status: 422,
      statusMessage: "VALIDATION_FAIL",
      cause: form.error.issues,
    });
  }

  const duplicateFlag = await db.query.Article.findFirst({
    where: (fields, { eq }) => eq(fields.slug, formatToSlug(form.data.title)),
  });

  if (duplicateFlag) {
    throw createError({
      status: 422,
      statusMessage: "ARTICLE_DUPLICATED",
      message: "Article is already created !",
    });
  }

  const result = await db
    .insert(Article)
    .values({
      slug: formatToSlug(form.data.title),
      title: form.data.title,
      content: form.data.content,
      published: form.data.isPublished,
      description: form.data.description,
    })
    .then(async (res) => {
      if (res[0].affectedRows > 0) {
        const data = await db.query.Article.findFirst({
          where: (fields, { eq }) =>
            eq(fields.slug, formatToSlug(form.data.title)),
        });
        return data;
      } else return undefined;
    });

  return result;
});
