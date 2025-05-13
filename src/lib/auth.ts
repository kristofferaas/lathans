import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/env";

const baseURL = env.VERCEL_URL
  ? `https://${env.VERCEL_URL}`
  : "http://localhost:3000";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  baseURL,
  secret: env.BETTER_AUTH_SECRET,
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "vipps",
          clientId: env.VIPPS_CLIENT_ID,
          clientSecret: env.VIPPS_CLIENT_SECRET,
          authorizationUrl:
            "https://apitest.vipps.no/access-management-1.0/access/oauth2/auth",
          tokenUrl:
            "https://apitest.vipps.no/access-management-1.0/access/oauth2/token",
          userInfoUrl: "https://apitest.vipps.no/vipps-userinfo-api/userinfo",
          redirectURI: `${baseURL}/api/auth/oauth2/callback/vipps`,
          responseType: "code",
          authentication: "post",
          pkce: true,
          scopes: ["openid", "email", "phoneNumber", "address", "name"],
        },
      ],
    }),
    nextCookies(),
  ],
});
