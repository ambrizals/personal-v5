import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export default router({
  login: publicProcedure
    .input(
      z.object({
        identity: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await db.query.Users.findFirst({
        where: (fields, { eq }) => eq(fields.username, input.identity),
      });

      if (user === undefined) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Fail to validate identity",
        });
      }

      const flag = await verifyHash(user.password, input.password);

      if (flag) {
        const token = generateJwtToken({ id: user.id });
        return {
          token,
          type: "Bearer",
        };
      } else {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Your identity or password is missmatch, please check again",
        });
      }
    }),
});
