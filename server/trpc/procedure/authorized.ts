import { authMiddleware } from "../middleware/auth";
import { publicProcedure } from "../trpc";

export const authorizedProcedure = publicProcedure.use(authMiddleware);
