import { RouterContext } from "https://deno.land/x/oak/mod.ts";

export const fetchUrl = async (url: string, ctx?: RouterContext) => {
  const res = await fetch(url)
  console.log(res)
  // if (res.status !== 200) {
  //   ctx && (ctx.response.status = 403)
  // } else {
  //   ctx && (ctx.response.status = 200)
  // }
  ctx && (ctx.response.status = res.status)
  const body = new Uint8Array(await res.arrayBuffer());
  return body
}