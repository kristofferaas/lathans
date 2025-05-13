import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  server: {
    // General
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    // Turso
    TURSO_AUTH_TOKEN: z.string().min(1),
    TURSO_DATABASE_URL: z.string().min(1),
    // BetterAuth
    BETTER_AUTH_SECRET: z.string().min(1),
    // Vipps
    VIPPS_CLIENT_ID: z.string().min(1),
    VIPPS_CLIENT_SECRET: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    // General
    NODE_ENV: process.env.NODE_ENV,
    // Turso
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    // BetterAuth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    // Vipps
    VIPPS_CLIENT_ID: process.env.VIPPS_CLIENT_ID,
    VIPPS_CLIENT_SECRET: process.env.VIPPS_CLIENT_SECRET,
  },
});
