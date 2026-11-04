import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => next())
  .server(({ next }) => next({ context: {} }));

export const requestMiddleware = createMiddleware({ type: "request" }).server(({ next }) =>
  next({ context: {} }),
);

export const requireUser = createMiddleware({ type: "function" }).server(async () => {
  setResponseStatus(401);
  throw Object.assign(new Error("Unauthorized"), { status: 401, code: "UNAUTHORIZED" });
});

export const requireUserRoute = createMiddleware({ type: "request" }).server(async () =>
  Response.json({ error: "Unauthorized" }, { status: 401 }),
);
