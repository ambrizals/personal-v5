import { httpLink } from "@trpc/client";
import { createTRPCNuxtClient, httpBatchLink } from "trpc-nuxt/client";
import type { AppRouter } from "~/server/trpc/routers";

export default defineNuxtPlugin(() => {
  /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
  const batchClient = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "/api/trpc",
      }),
    ],
  });

  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpLink({
        url: "/api/trpc",
      }),
    ],
  });

  return {
    provide: {
      batchClient,
      client,
    },
  };
});
