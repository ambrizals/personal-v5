import { httpLink } from "@trpc/client";
import { createTRPCNuxtClient, httpBatchLink } from "trpc-nuxt/client";
import type { AppRouter } from "~/server/trpc/routers";

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useCookie("auth");
  let url = "/api/trpc";

  if (import.meta.server) {
    url = `http://localhost:${nuxtApp.$config.port}${url}`;
  }

  /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
  const batchClient = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: url,
        headers: () => {
          return {
            auth: auth.value ?? undefined,
          };
        },
      }),
    ],
  });

  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpLink({
        url: url,
        headers: () => {
          return {
            auth: auth.value ?? undefined,
          };
        },
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
