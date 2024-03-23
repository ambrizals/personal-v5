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
      if (input.identity === "admin" && input.password === "admin") {
        const token = generateJwtToken({ id: 1 });
        return {
          token,
          type: "Bearer",
        };
      } else {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "IDENTITY_MISS_MATCHED",
        });
      }
    }),
});
