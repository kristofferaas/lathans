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
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string().url(),
  },
  runtimeEnv: {
    // General
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },
});
