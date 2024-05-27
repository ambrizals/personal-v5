import { httpLink } from "@trpc/client";
import { createTRPCNuxtClient, httpBatchLink } from "trpc-nuxt/client";
import type { AppRouter } from "~/server/trpc/routers";

export default defineNuxtPlugin((nuxtApp) => {
  const headers = useRequestHeaders();
  let url = "/api/trpc";

  if (import.meta.server) {
    url = `http://${nuxtApp.$config.serverUrl}:${nuxtApp.$config.port}${url}`;
    // console.log("server hits =>", url);
  }

  /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
  const batchClient = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: url,
        headers: headers,
      }),
    ],
  });

  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpLink({
        url: url,
        headers: headers,
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
