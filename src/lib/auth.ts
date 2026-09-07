import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
// @ts-ignore - types provided via src/types/better-sqlite3.d.ts
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// For local + Vercel demo we use SQLite file.
// On Vercel the file is ephemeral (/tmp) — perfect for mock demo.
let database: any;
try {
  const dbPath = process.env.VERCEL ? "/tmp/auth.db" : "./data/auth.db";
  if (!process.env.VERCEL) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
  database = new Database(dbPath);
} catch (e) {
  console.warn("Better Auth DB init failed, falling back to :memory:", e);
  database = new Database(":memory:");
}

export const auth = betterAuth({
  database,
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-prod-32chars!!",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  session: {
    cookieCache: { enabled: true },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin", "owner"],
    }),
  ],
  // Rate limiting is built-in
});

export type Session = typeof auth.$Infer.Session;
