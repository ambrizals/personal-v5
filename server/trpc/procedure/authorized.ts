import { authMiddleware } from "../middleware/auth";
import { preAuthMiddleware } from "../middleware/pre-auth";
import { publicProcedure } from "../trpc";

export const authorizedProcedure = publicProcedure.use(authMiddleware);
export const preAuthorizedProcedure = publicProcedure.use(preAuthMiddleware);