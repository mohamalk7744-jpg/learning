import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { customAuth } from "./custom-auth";
import { COOKIE_NAME } from "../../shared/const.js";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get token from cookie or Authorization header
    const cookies = opts.req.headers.cookie || "";
    const cookieMap = new Map(
      cookies.split(";").map((c) => {
        const [key, value] = c.trim().split("=");
        return [key, value];
      })
    );
    
    const authHeader = opts.req.headers.authorization || opts.req.headers.Authorization;
    let token: string | undefined;
    
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice("Bearer ".length).trim();
    } else {
      token = cookieMap.get(COOKIE_NAME);
    }

    if (token) {
      user = await customAuth.authenticateRequest(token);
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
