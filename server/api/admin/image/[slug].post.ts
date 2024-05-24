import { join } from "path";
import { z } from "zod";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event);
  const { rootDirectory, public: publicConfig } = useRuntimeConfig();
  let target: string = "";

  switch (slug) {
    case "posts":
      target = slug;
      break;

    default:
      throw createError({
        statusCode: 422,
        message: "Unknown types",
      });
  }
  const body = await readFormData(event);

  const imgPayload: any[] = [];
  body.forEach((value) => imgPayload.push(value));

  const rules = z.array(
    z
      .custom<File>()
      .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
        message: "Only images is allowed",
      })
      .transform((file) => ({
        file,
        name: `${uuidv4()}.${file.name.split(".")[1]}`,
      }))
  );

  const form = rules.safeParse(imgPayload);

  if (form.success === false) {
    throw createError({
      statusMessage: "Validation fail",
      cause: form.error.issues,
      statusCode: 422,
    });
  }

  const uploadDirs = join(rootDirectory, `storage/${target}`);

  // Check if directory not exists, it will created
  await fs.promises.mkdir(uploadDirs, { recursive: true });
  try {
    for (const file of form.data) {
      const buffer = await file.file.arrayBuffer();
      await fs.promises.writeFile(
        join(uploadDirs, file.name),
        Buffer.from(buffer)
      );
    }
  } catch (error) {
    for (const file of form.data) {
      fs.rm(join(uploadDirs, file.name), () => {});
    }
    throw createError({
      status: 422,
      statusMessage: "UPLOAD ERROR",
      cause: "MOVE_FILE_ERR",
    });
  }

  return form.data.map((file) => ({
    url: `${publicConfig.assetUrl}/${target}/${encodeURI(file.name)}`,
    title: file.name,
    alt: file.name,
  }));
});
