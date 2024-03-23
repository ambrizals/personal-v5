import type { inferAsyncReturnType } from "@trpc/server";
import type { H3Event } from "h3";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = (event: H3Event) => {
  const cookies = parseCookies(event);
  const authorization: string = cookies.auth;

  return {
    authorization,
    event,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
