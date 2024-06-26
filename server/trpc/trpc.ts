// Types
import type { inferRouterOutputs } from "@trpc/server";

/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { initTRPC } from "@trpc/server";
import type { Context } from "~/server/trpc/context";
import type { AppRouter } from "./routers";

const t = initTRPC.context<Context>().create();

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type ArticleOutputAPI = RouterOutput["blog"]["article"];
export type BlogReadOutputAPI = RouterOutput["blog"]["read"];
export type PageListOutputAPI = RouterOutput["page"]["list"];
export type PageEntryOutputAPI = RouterOutput["page"]["entry"];