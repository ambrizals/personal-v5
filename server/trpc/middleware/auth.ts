import { middleware } from "../trpc";

export const authMiddleware = middleware(async (opts) => {
  const { ctx } = opts;

  const payload = verifyJwtToken<{ id: number }>(ctx.authorization);

  return opts.next({
    ctx: {
      user: payload.id,
    },
  });
});
