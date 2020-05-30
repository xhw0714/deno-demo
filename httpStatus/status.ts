import { RouterContext } from "https://deno.land/x/oak/mod.ts";
export const status = (ctx: RouterContext, status: number, text: string) => {
  ctx.response.body = text
  ctx.response.status = status
}