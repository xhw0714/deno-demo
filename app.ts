import { Application, send, Router } from "https://deno.land/x/oak/mod.ts";
import apiRouter from './router/api.ts'

let port: number = 8000

Deno.args.forEach(e => {
  const env = e.split('=')
  if (env[0] === '--port') {
    port = Number(env[1])
  }
})


const app = new Application();
const router = new Router()

app.addEventListener("error", (evt) => {
  // Will log the thrown error to the console.
  console.log(evt.error);
});

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
  console.log(await ctx.request.body())
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});


// // Hello World!
// app.use(async (ctx) => {
//   let res = null
//   let body = null
//   try {
//     res = await fetch('http://www.kidcares.cn/abc')
//     console.log(res)
//     body = new Uint8Array(await res.arrayBuffer());
//   } catch (error) {
//     console.log(error)
//   }
//   ctx.response.body = body;
// });

app.use(apiRouter.routes())
app.use(apiRouter.allowedMethods())

app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: `${Deno.cwd()}/web/dist`,
    index: "index.html",
  });
});


console.log(`listen in http://localhost:${port}`)
await app.listen({ port: port });

