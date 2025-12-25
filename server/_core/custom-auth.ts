import { SignJWT, jwtVerify } from "jose";
import * as db from "../db";
import { ENV } from "./env";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.js";
import type { User } from "../../drizzle/schema";

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
};

class CustomAuthService {
  private getSecret() {
    const secret = ENV.cookieSecret;
    if (!secret) {
      throw new Error("JWT_SECRET is required for authentication");
    }
    return new TextEncoder().encode(secret);
  }

  async createSessionToken(
    userId: number,
    email: string,
    name: string,
    expiresInMs: number = ONE_YEAR_MS,
  ): Promise<string> {
    const issuedAt = Date.now();
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSecret();

    return new SignJWT({
      userId,
      email,
      name,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .setIssuedAt(Math.floor(issuedAt / 1000))
      .sign(secretKey);
  }

  async verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
      const secretKey = this.getSecret();
      const { payload } = await jwtVerify(token, secretKey, {
        algorithms: ["HS256"],
      });

      const { userId, email, name } = payload as Record<string, unknown>;

      if (
        typeof userId !== "number" ||
        typeof email !== "string" ||
        typeof name !== "string"
      ) {
        return null;
      }

      return { userId, email, name };
    } catch (error) {
      console.warn("[Auth] Token verification failed:", error);
      return null;
    }
  }

  async authenticateRequest(token: string | undefined | null): Promise<User> {
    if (!token) {
      throw new Error("Authentication required");
    }

    const session = await this.verifySessionToken(token);
    if (!session) {
      throw new Error("Invalid session token");
    }

    // Get user from database
    const user = await db.getUserById(session.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update last signed in
    await db.upsertUser({
      openId: user.openId,
      lastSignedIn: new Date(),
    });

    return user;
  }
}

export const customAuth = new CustomAuthService();

