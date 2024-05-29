import { router } from "../trpc";
import account from "./account";
import auth from "./auth";
import blog from "./blog";
import page from "./page";

export const appRouter = router({
  auth,
  account,
  blog,
  page,
});

// export type definition of API
export type AppRouter = typeof appRouter;
