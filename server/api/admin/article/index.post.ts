import { join } from "path";
import { z } from "zod";
import fs from "fs";
import sharp from "sharp";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
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

  if (form.data.cover) {
    const uploadDir = join(runtimeConfig.rootDirectory, "storage/cover");
    const thumbsDir = join(runtimeConfig.rootDirectory, "storage/thumbnails");
    // Check if directory is exists, so app can create recursively
    await fs.promises.mkdir(uploadDir, { recursive: true });
    await fs.promises.mkdir(thumbsDir, { recursive: true });

    const newFilePath = join(uploadDir, form.data.cover.name);
    const newThumbsPath = join(thumbsDir, form.data.cover.name);

    // Save the uploaded file
    try {
      const buffer = await form.data.cover.arrayBuffer();
      const thumbs = await sharp(Buffer.from(buffer))
        .resize({
          width: 256,
          height: 256,
          fit: "cover",
        })
        .toBuffer();
      await fs.promises.writeFile(newFilePath, Buffer.from(buffer));
      await fs.promises.writeFile(newThumbsPath, thumbs);
    } catch (err) {
      throw createError({
        status: 422,
        statusMessage: "UPLOAD ERROR",
        cause: "MOVE_FILE_ERR",
      });
    }
  }

  const result = await db
    .insert(Article)
    .values({
      slug: formatToSlug(form.data.title),
      title: form.data.title,
      content: form.data.content,
      published: form.data.isPublished,
      description: form.data.description,
      cover: form.data.cover?.name,
      thumbnail: form.data.cover?.name,
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
