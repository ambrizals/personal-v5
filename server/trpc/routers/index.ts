import { router } from "../trpc";
import account from "./account";
import auth from "./auth";
import blog from "./blog";

export const appRouter = router({
  auth,
  account,
  blog,
});

// export type definition of API
export type AppRouter = typeof appRouter;
