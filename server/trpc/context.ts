import type { inferAsyncReturnType } from "@trpc/server";
import type { H3Event } from "h3";
import { parseStringToObject } from "../utils/string";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = (event: H3Event) => {
  const headers = getRequestHeaders(event);
  const cookies = parseStringToObject(headers.cookie ?? "");
  const authorization: string | undefined = cookies.auth;

  return {
    authorization,
    event,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
