import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get user loan details by Clerk User ID.
 */
export const getUserLoanDetail = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("userLoanDetails"),
      _creationTime: v.number(),
      clerkUserId: v.string(),
      name: v.string(),
      amount: v.number(),
      nominalRate: v.number(),
      termYears: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const userLoan = await ctx.db
      .query("userLoanDetails")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
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
      // Add other fields here if they were added to the schema
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("principalMortgageOffers").collect();
  },
});

/**
 * (For Testing/Seeding) Add a new principal mortgage offer.
 */
export const addPrincipalMortgageOffer = mutation({
  args: {
    name: v.string(),
    nominalRate: v.number(),
    // Add other fields corresponding to your schema if necessary
  },
  returns: v.id("principalMortgageOffers"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("principalMortgageOffers", args);
  },
});
