import { z } from "zod";
import { authorizedProcedure } from "../procedure/authorized";
import { router } from "../trpc";
import { eq } from "drizzle-orm";

export default router({
  changePassword: authorizedProcedure
    .input(
      z
        .object({
          password: z.string(),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: `Password don't matched`,
        })
    )
    .mutation(async ({ input, ctx }) => {
      const hashed = await makeHash(input.password);
      const user = await db
        .update(Users)
        .set({
          password: hashed,
        })
        .where(eq(Users.id, ctx.user));

      if (user[0].affectedRows > 0) {
        return {
          message: "New password is already saved",
        };
      } else {
        return {
          message: "failed",
        };
      }
    }),
});
