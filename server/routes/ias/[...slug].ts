import { createReadStream, existsSync } from "fs";
import { join, resolve } from "path";

export default defineEventHandler(async (event) => {
  const url = event.node.req.url;
  const { rootDirectory } = useRuntimeConfig();

  if (url) {
    if (url.startsWith("/ias/")) {
      const filePath = decodeURI(url.replace("/ias/", ""));

      const storagePath = join(rootDirectory, "storage", filePath);

      const resolvedFilePath = resolve(storagePath);

      if (existsSync(resolvedFilePath)) {
        const fileStream = createReadStream(resolvedFilePath);
        return sendStream(event, fileStream);
      } else {
        console.log("not found", storagePath);
        throw createError({
          statusCode: 404,
          message: "Not found",
        });
      }
    }
  } else {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }
});
