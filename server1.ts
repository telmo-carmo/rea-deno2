/*

React @MUI + deno 2 app + vite build

deno run --allow-env --allow-net --allow-read --allow-write  server1.ts
 OR
deno run dev:api


*/
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { Middleware } from "jsr:@oak/oak/middleware";

import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { format } from "https://deno.land/std/datetime/mod.ts";
import {  create,  getNumericDate,  verify } from "https://deno.land/x/djwt/mod.ts";
import { Logger } from "https://deno.land/x/log/mod.ts";

import routeStaticFilesFrom from "./routeStaticFilesFrom.ts";

// config logging:
const log_minLevelConsole = "DEBUG";
const log_minLevelFile = "WARNING";
const log_fileName = "./server1.log";
const log_pure = false; // true == leaving out e.g. the time info and Level info
export const logger = await Logger.getInstance(
  log_minLevelConsole,
  log_minLevelFile,
  log_fileName,
  log_pure,
);

const jwt_key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(Deno.env.get("JWT_SECRET_KEY") || "my-very-secret-key"),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"],
);

interface BnData {
  ename: string;
  job: string;
  sal: number;
  comm: number;
}

const my_bonus: BnData[] = [
  { ename: "Alice", job: "Manager", sal: 5000, comm: 500 },
  { ename: "Bob", job: "Developer", sal: 4000, comm: 300 },
  { ename: "Charlie", job: "Designer", sal: 3500, comm: 200 },
  { ename: "Joana", job: "Tester", sal: 2500, comm: 100 },
];

// Function to parse the port from command-line arguments
function getPortFromArgs(): number {
  const args = Deno.args;
  const default_port = 8000;

  // Find the port argument (e.g., --port=8080 or -p 8080)
  let portArg: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--port=")) {
      portArg = args[i].substring("--port=".length);
      break;
    } else if (args[i] === "-p" && i + 1 < args.length) {
      portArg = args[i + 1];
      break;
    }
  }

  if (!portArg) {
    console.log("Using default port: " + default_port);
    return default_port; // Default port
  }

  const port = Number(portArg);

  if (isNaN(port) || port < 1 || port > 65535) {
    console.error("Invalid port number provided. Using default port: " + default_port);
    return default_port;
  }

  return port;
}

// Logging middleware
const  mw_logger : Middleware  = async (context, next) => {
  logger.debug(`${context.request.method} ${context.request.url}`);
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.debug(`Response status: ${context.response.status} - ${ms}ms`);
}

const router = new Router();
router
  .use(mw_logger)
  .get("/api/home", (ctx) => {
    const now = new Date();
    const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");
    ctx.response.body = {
      message: "Data from API",
      items: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: formattedNow },
      ],
    };
  })
  .post("/auth/login", async (context) => {
    const { uid, pwd } = await context.request.body.json();
    const username = uid, password = pwd;
    logger.info(`login(${username},${password})`);
    // Replace with your user validation logic
    if (password === "123") {
      const jwt = await create(
        { alg: "HS256", typ: "JWT" }, // expires 1h
        { sub: username, exp: getNumericDate(60 * 60), role: "user" },
        jwt_key,
      );
      logger.warning(`gen JWT: ${jwt}`);
      context.response.body = { token: jwt, error: null, username: username };
    } else {
      context.response.status = 401;
      context.response.body = {
        error: "Invalid username or password",
        token: null,
      };
    }
  })
  .get("/auth/health", async (ctx) => {
    logger.info("GET /auth/health");
    const authHeader = ctx.request.headers.get("Authorization");
    if (!authHeader) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authorization header missing" };
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const payload = await verify(token, jwt_key);
      console.log("Token payload:", payload);
      const now = new Date();
      const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");
      ctx.response.body = {
        status: "success",
        message: "Build a CRUD API with Deno",
        now: formattedNow,
      };
    } catch (_err) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Invalid token" };
    }
  });

router
  .get("/api/bonus", (context) => {
    logger.info("GET /api/bonus count:" + my_bonus.length);
    context.response.body = my_bonus;
  })
  .get("/api/bonus/:id", (context) => {
    const id = context.params.id;
    logger.info(`GET /api/bonus/${context.params.id}`);
    const bn = my_bonus.find((e) => e.ename === id);
    if (bn) {
      context.response.body = bn;
    } else {
      context.response.status = 404;
      context.response.body = { message: "Bonus not found" };
    }
  })
  .post("/api/bonus", async (context) => {
    const body = await context.request.body.json() as BnData;
    my_bonus.push(body);
    context.response.status = 201;
    context.response.body = body;
  })
  .put("/api/bonus/:id", async (context) => {
    const id = context.params.id;
    const body = await context.request.body.json() as BnData;
    const index = my_bonus.findIndex((e) => e.ename === id);
    if (index !== -1) {
      my_bonus[index] = body;
      context.response.body = body;
    } else {
      context.response.status = 404;
      context.response.body = { message: "Bonus not found" };
    }
  })
  .delete("/api/bonus/:id", (context) => {
    logger.info(`DELETE /api/bonus/${context.params.id}`);
    const id = context.params.id;
    const index = my_bonus.findIndex((e) => e.ename === id);
    if (index !== -1) {
      my_bonus.splice(index, 1);
      context.response.status = 204;
    } else {
      context.response.status = 404;
      context.response.body = { message: "Bonus not found" };
    }
  });

//---

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/dist`,
  `${Deno.cwd()}/public`,
]));

const my_port = getPortFromArgs();
logger.info(`Server listening on port ${my_port}`);
await app.listen({ port: my_port });
