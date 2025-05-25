import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get user loan details by Clerk User ID.
 */
export const getUserLoan = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("userLoan"),
      _creationTime: v.number(),
      userId: v.string(),
      loanName: v.optional(v.string()),
      loanAmount: v.optional(v.number()),
      nominalRate: v.optional(v.number()),
      effectiveRate: v.optional(v.number()),
      termYears: v.optional(v.number()),
      bank: v.optional(v.string()),
      screenshotStorageId: v.optional(v.id("_storage")),
      union: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const userLoan = await ctx.db
      .query("userLoan")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();
    return userLoan;
  },
});

/**
 * List all principal mortgage offers.
 */
export const listPrincipalMortgageOffers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("principalMortgageOffers"),
      _creationTime: v.number(),
      name: v.string(),
      nominalRate: v.number(),
      effectiveRate: v.number(),
      // Add other fields here if they were added to the schema
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("principalMortgageOffers").collect();
  },
});
