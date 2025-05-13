import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "vipps",
          clientId: process.env.VIPPS_CLIENT_ID!,
          clientSecret: process.env.VIPPS_CLIENT_SECRET!,
          authorizationUrl:
            "https://apitest.vipps.no/access-management-1.0/access/oauth2/auth",
          tokenUrl:
            "https://apitest.vipps.no/access-management-1.0/access/oauth2/token",
          userInfoUrl: "https://apitest.vipps.no/vipps-userinfo-api/userinfo",
          redirectURI: "http://localhost:3000/api/auth/oauth2/callback/vipps",
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
