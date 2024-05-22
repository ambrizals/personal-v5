import { join } from "path";
import { z } from "zod";
import fs from "fs";
import sharp from "sharp";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const current = await db.query.Article.findFirst({
    where: (fields, { eq }) => eq(fields.id, Number(id)),
  });

  if (current === undefined) {
    throw createError({
      status: 404,
      statusMessage: "Not found",
    });
  }

  const runtimeConfig = useRuntimeConfig();
  const body = await readFormData(event);
  const payload: Record<string, any> = {};
  body.forEach((value, key) => (payload[key] = value));

  const rules = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    description: z.string().optional(),
    isPublished: z
      .custom<string>()
      .transform((published) => {
        if (published !== undefined) {
          return JSON.parse(published);
        }
        return published;
      })
      .refine((value) => value !== undefined, {
        message: "Is published is required",
      })
      .refine((value) => typeof value === "boolean", {
        message: "Is published must boolean",
      })
      .optional(),
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

  if (form.data.cover) {
    const uploadDir = join(runtimeConfig.rootDirectory, "storage/cover");
    const thumbsDir = join(runtimeConfig.rootDirectory, "storage/thumbs");
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

      if (current.cover) {
        fs.rm(join(uploadDir, current.cover), () => {});
      }

      if (current.thumbnail) {
        fs.rm(join(uploadDir, current.thumbnail), () => {});
      }
    } catch (err) {
      throw createError({
        status: 422,
        statusMessage: "UPLOAD ERROR",
        cause: "MOVE_FILE_ERR",
      });
    }
  }

  const result = await db
    .update(Article)
    .set({
      slug: form.data.title ? formatToSlug(form.data.title) : current.slug,
      title: form.data.title,
      content: form.data.content,
      published: form.data.isPublished,
      description: form.data.description,
      cover: form.data.cover?.name,
      thumbnail: form.data.cover?.name,
    })
    .where(eq(Article.id, current.id))
    .then(async (res) => {
      if (res[0].affectedRows > 0) {
        const curr = await db.query.Article.findFirst({
          where: (fields, { eq }) => eq(fields.id, current.id),
        });
        return curr;
      }
      return undefined;
    });

  if (result) {
    return result;
  } else {
    throw createError({
      message: "Something wrong in server",
      statusCode: 422,
    });
  }
});
