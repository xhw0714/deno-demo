import { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import ShortUniqueId from "https://cdn.jsdelivr.net/npm/short-unique-id@latest/short_uuid/mod.ts";
import { Site, Server, Option } from "../models/server.ts";
import { persistData, fetchData } from "../handlers/db.ts";
import { status } from "../httpStatus/status.ts";
import { fetchUrl } from "../handlers/fetchUrl.ts";
import { Pool } from "../models/pool.ts";
const uid = new ShortUniqueId();
const serverPath = "./db/server.json";
const poolPath = "./db/pool.json";

const add = async (ctx: RouterContext, path: string, postData?: any) => {
  if (ctx.request.hasBody && !postData) {
    const result = await ctx.request.body();
    const data = await fetchData(path);
    try {
      await persistData(path, [
        ...data,
        {
          id: uid(),
          ...result.value,
        },
      ]);
    } catch (error) {
      status(ctx, 403, "payload error");
    }
    ctx.response.body = "success";
  } else if (postData) {
    await persistData(path, postData);
    ctx.response.body = "success";
  } else {
    status(ctx, 403, "payload error");
  }
};

const get = async (ctx: RouterContext, path: string) => {
  console.log(path);
  const result = await fetchData(path);
  ctx.response.body = result;
};

const router = new Router({
  prefix: "/api",
});

router.post("/fetch", async (ctx) => {
  const result = await ctx.request.body();
  const data = await fetchUrl(result.value.url, ctx);
  ctx.response.body = data;
});

router.get("/getserver", async (ctx) => {
  await get(ctx, serverPath);
});

router.post("/updateserver", async (ctx) => {
  if (ctx.request.hasBody) {
    const result = await ctx.request.body();
    const data = await fetchData(serverPath);
    const server = data.map((e: Server) => {
      if (e.id === result.value.id) {
        return {
          ...e,
          title: result.value.title,
        };
      }
      return e;
    });
    try {
      await persistData(serverPath, server);
    } catch (error) {
      status(ctx, 403, "payload error");
    }
    ctx.response.body = "success";
  } else {
    status(ctx, 403, "payload error");
  }
});

router.post("/addserver", async (ctx) => {
  const result = await ctx.request.body();
  const data = await fetchData(serverPath);
  await add(ctx, serverPath, [
    ...data,
    {
      id: uid(),
      title: result.value.title,
    },
  ]);
});

router.delete("/delserver", async (ctx) => {
  if (ctx.request.hasBody) {
    const result = await ctx.request.body();
    const data = await fetchData(serverPath);
    await add(
      ctx,
      serverPath,
      data.filter((e) => e.id !== result.value.id)
    );
  }
});

router.post("/addsite", async (ctx) => {
  if (ctx.request.hasBody) {
    const result = await ctx.request.body();
    const data = await fetchData(serverPath);
    const server = data.map((e) => {
      if (e.id === result.value.serverId) {
        const site = {
          id: uid(),
          title: result.value.title,
          urlName: result.value.urlName,
          url: result.value.url,
          webUrl: result.value.webUrl
        };
        return {
          ...e,
          sites: e.sites ? [...e.sites, site] : [site],
        };
      }
      return e;
    });
    try {
      await persistData(serverPath, server);
    } catch (error) {
      status(ctx, 403, "payload error");
    }
    ctx.response.body = "success";
  } else {
    status(ctx, 403, "payload error");
  }
});

router.post("/updatesite", async (ctx) => {
  if (ctx.request.hasBody) {
    const result = await ctx.request.body();
    const data = await fetchData(serverPath);
    const server = data.map((e: Server) => {
      if (e.id === result.value.serverId) {
        const sites = e.sites?.map((e1: Site) => {
          if (e1.id === result.value.id) {
            return {
              ...e1,
              title: result.value.title,
              urlName: result.value.urlName,
              url: result.value.url,
              webUrl: result.value.webUrl
            };
          }
          return e1;
        });
        return {
          ...e,
          sites: sites,
        };
      }
      return e;
    });
    try {
      await persistData(serverPath, server);
    } catch (error) {
      status(ctx, 403, "payload error");
    }
    ctx.response.body = "success";
  } else {
    status(ctx, 403, "payload error");
  }
});

router.delete("/delsite", async (ctx) => {
  if (ctx.request.hasBody) {
    const result = await ctx.request.body();
    const data = await fetchData(serverPath);
    const server = data.map((e: Server) => {
      if (e.id === result.value.serverId) {
        e.sites = e.sites?.filter((e1: Site) => e1.id !== result.value.id);
      }
      return e;
    });
    try {
      await persistData(serverPath, server);
    } catch (error) {
      status(ctx, 403, "payload error");
    }
    ctx.response.body = "success";
  } else {
    status(ctx, 403, "payload error");
  }
});

router.post("/addoptions", async (ctx) => {
  if (ctx.request.hasBody) {
    const result = await ctx.request.body();
    const data = await fetchData(serverPath);
    console.log(result.value);
    const server = data.map((e: Server) => {
      if (e.id === result.value.serverId) {
        return {
          ...e,
          sites:
            e.sites &&
            e.sites.map((e1: Site) => {
              if (e1.id === result.value.siteId) {
                const option = {
                  id: uid(),
                  title: result.value.title,
                  link: result.value.link,
                };
                return {
                  ...e1,
                  options: e1.options ? [...e1.options, option] : [option],
                };
              }
              return e1;
            }),
        };
      }
      return e;
    });
    try {
      await persistData(serverPath, server);
    } catch (error) {
      status(ctx, 403, "payload error");
    }
    ctx.response.body = "success";
  } else {
    status(ctx, 403, "payload error");
  }
});

router.post("/updateoptions", async (ctx) => {
  if (ctx.request.hasBody) {
    const result = await ctx.request.body();
    const data = await fetchData(serverPath);
    const server = data.map((e: Server) => {
      if (e.id === result.value.serverId) {
        e.sites &&
          e.sites.map((e1: Site) => {
            if (e1.id === result.value.siteId) {
              e1.options &&
                e1.options.map((e2: Option) => {
                  if (e2.id === result.value.id) {
                    e2.title = result.value.title;
                    e2.link = result.value.link;
                  }
                });
            }
          });
      }
      return e;
    });
    try {
      await persistData(serverPath, server);
    } catch (error) {
      status(ctx, 403, "payload error");
    }
    ctx.response.body = "success";
  } else {
    status(ctx, 403, "payload error");
  }
});

router.delete("/deloption", async (ctx) => {
  if (ctx.request.hasBody) {
    const result = await ctx.request.body();
    const data = await fetchData(serverPath);
    const server = data.map((e: Server) => {
      if (e.id === result.value.serverId) {
        e.sites &&
          e.sites.map((e1: Site) => {
            if (e1.id === result.value.siteId) {
              e1.options =
                e1.options &&
                e1.options.filter((e2: Option) => e2.id !== result.value.id);
            }
          });
      }
      return e;
    });
    try {
      await persistData(serverPath, server);
    } catch (error) {
      status(ctx, 403, "payload error");
    }
    ctx.response.body = "success";
  } else {
    status(ctx, 403, "payload error");
  }
});

router.post("/update", async (ctx) => {
  try {
    const result = await ctx.request.body();
    await persistData(serverPath, result.value);
    ctx.response.body = "success";
  } catch (error) {
    status(ctx, 403, "payload error");
  }
});

router.get("/getpool", async (ctx) => {
  await get(ctx, poolPath);
});

router.post("/addpool", async (ctx) => {
  const result = await ctx.request.body();
  const data = await fetchData(poolPath);
  await add(ctx, poolPath, [
    ...data,
    {
      id: uid(),
      title: result.value.title,
      api: result.value.api,
      keyword: result.value.keyword,
    },
  ]);
});

router.delete("/delpool", async (ctx) => {
  if (ctx.request.hasBody) {
    const result = await ctx.request.body();
    const data = await fetchData(poolPath);
    const pool = data.filter((e: Pool) => e.id !== result.value.id);
    try {
      await persistData(poolPath, pool);
    } catch (error) {
      status(ctx, 403, "payload error");
    }
    ctx.response.body = "success";
  } else {
    status(ctx, 403, "payload error");
  }
});

router.post("/updatepool", async (ctx) => {
  if (ctx.request.hasBody) {
    const result = await ctx.request.body();
    const data = await fetchData(poolPath);
    const pool = data.map((e: Pool) => {
      if (e.id === result.value.id) {
        return {
          ...e,
          title: result.value.title,
          api: result.value.api,
          keyword: result.value.keyword,
        };
      }
      return e;
    });
    try {
      await persistData(poolPath, pool);
    } catch (error) {
      status(ctx, 403, "payload error");
    }
    ctx.response.body = "success";
  } else {
    status(ctx, 403, "payload error");
  }
});

export default router;
