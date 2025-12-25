import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { customAuth } from "../_core/custom-auth";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.js";
import { getSessionCookieOptions } from "../_core/cookies";
import crypto from "crypto";

// Helper to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Register endpoint
export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      // Check if user exists
      const existingUser = await db.getUserByEmail(input.email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Create user with hashed password
      const hashedPassword = hashPassword(input.password);
      const openId = `custom_${crypto.randomBytes(16).toString("hex")}`;
      
      await db.createUser({
        openId,
        name: input.name,
        email: input.email,
        loginMethod: "email",
        passwordHash: hashedPassword,
      });

      const user = await db.getUserByEmail(input.email);
      if (!user) {
        throw new Error("Failed to create user");
      }

      // Create session token
      const sessionToken = await customAuth.createSessionToken(
        user.id,
        user.email || "",
        user.name || "",
      );

      return {
        sessionToken,
        user: {
          id: user.id,
          openId: user.openId,
          name: user.name,
          email: user.email,
          loginMethod: user.loginMethod,
          lastSignedIn: user.lastSignedIn?.toISOString() || new Date().toISOString(),
        },
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const user = await db.getUserByEmail(input.email);
      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Verify password
      const hashedPassword = hashPassword(input.password);
      if (user.passwordHash !== hashedPassword) {
        throw new Error("Invalid email or password");
      }

      // Update last signed in
      await db.upsertUser({
        openId: user.openId,
        lastSignedIn: new Date(),
      });

      // Create session token
      const sessionToken = await customAuth.createSessionToken(
        user.id,
        user.email || "",
        user.name || "",
      );

      return {
        sessionToken,
        user: {
          id: user.id,
          openId: user.openId,
          name: user.name,
          email: user.email,
          loginMethod: user.loginMethod,
          lastSignedIn: user.lastSignedIn?.toISOString() || new Date().toISOString(),
        },
      };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.user.id,
      openId: ctx.user.openId,
      name: ctx.user.name,
      email: ctx.user.email,
      loginMethod: ctx.user.loginMethod,
      lastSignedIn: ctx.user.lastSignedIn?.toISOString() || new Date().toISOString(),
    };
  }),
});

// Express routes for web authentication
export function registerCustomAuthRoutes(app: Express) {
  // Register endpoint
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ error: "Name, email, and password are required" });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: "Password must be at least 6 characters" });
        return;
      }

      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }

      const hashedPassword = hashPassword(password);
      const openId = `custom_${crypto.randomBytes(16).toString("hex")}`;

      await db.createUser({
        openId,
        name,
        email,
        loginMethod: "email",
        passwordHash: hashedPassword,
      });

      const user = await db.getUserByEmail(email);
      if (!user) {
        res.status(500).json({ error: "Failed to create user" });
        return;
      }

      const sessionToken = await customAuth.createSessionToken(
        user.id,
        user.email || "",
        user.name || "",
      );

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        success: true,
        user: {
          id: user.id,
          openId: user.openId,
          name: user.name,
          email: user.email,
          loginMethod: user.loginMethod,
          lastSignedIn: user.lastSignedIn?.toISOString() || new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("[Auth] Register failed:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const user = await db.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const hashedPassword = hashPassword(password);
      if (user.passwordHash !== hashedPassword) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      await db.upsertUser({
        openId: user.openId,
        lastSignedIn: new Date(),
      });

      const sessionToken = await customAuth.createSessionToken(
        user.id,
        user.email || "",
        user.name || "",
      );

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        success: true,
        user: {
          id: user.id,
          openId: user.openId,
          name: user.name,
          email: user.email,
          loginMethod: user.loginMethod,
          lastSignedIn: user.lastSignedIn?.toISOString() || new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });

  // Get current user
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const cookies = req.headers.cookie || "";
      const cookieMap = new Map(
        cookies.split(";").map((c) => {
          const [key, value] = c.trim().split("=");
          return [key, value];
        })
      );
      const token = cookieMap.get(COOKIE_NAME);

      if (!token) {
        res.status(401).json({ error: "Not authenticated", user: null });
        return;
      }

      const user = await customAuth.authenticateRequest(token);
      res.json({
        user: {
          id: user.id,
          openId: user.openId,
          name: user.name,
          email: user.email,
          loginMethod: user.loginMethod,
          lastSignedIn: user.lastSignedIn?.toISOString() || new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("[Auth] /api/auth/me failed:", error);
      res.status(401).json({ error: "Not authenticated", user: null });
    }
  });
}

