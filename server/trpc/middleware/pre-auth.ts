import { middleware } from "../trpc";

export const preAuthMiddleware = middleware((opts) => {
  const { ctx } = opts;

  if (ctx.authorization === undefined) {
    return opts.next({
      ctx: {
        user: null,
      },
    });
  }

  try {
    const payload = verifyJwtToken<{ id: number }>(ctx.authorization);

    return opts.next({
      ctx: {
        user: payload?.id ?? null,
      },
    });
  } catch (err) {
    return opts.next({
      ctx: {
        user: null,
      },
    });
  }
});
