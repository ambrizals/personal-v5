import { router } from "../trpc";
import account from "./account";
import auth from "./auth";

export const appRouter = router({
  auth,
  account,
});

// export type definition of API
export type AppRouter = typeof appRouter;
