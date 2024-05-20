export default defineEventHandler((event) => {
  const url = getRequestURL(event);

  if (url.pathname.includes("/api/admin")) {
    const headers = getRequestHeaders(event);
    if (headers.cookie) {
      const cookies = parseStringToObject(headers.cookie);

      try {
        verifyJwtToken<{ id: number }>(cookies.auth);
      } catch (error) {
        throw createError({
          statusCode: 422,
          statusMessage: "UNPROCESSABLE_ENTITY",
          message: "Invalid token",
        });
      }
    } else {
      throw createError({
        statusCode: 422,
        statusMessage: "UNPROCESSABLE_ENTITY",
        message: "Cannot process authorization",
      });
    }
  }
});
