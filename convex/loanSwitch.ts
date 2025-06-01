import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current active loan switch for a user
 */
export const getActiveLoanSwitch = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("loanSwitch"),
      _creationTime: v.number(),
      userId: v.string(),
      targetOfferId: v.id("principalMortgageOffers"),
      status: v.union(
        v.literal("pending"),
        v.literal("cancelled"),
        v.literal("completed"),
      ),
      targetLoanName: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Get the most recent pending loan switch
    const activeLoanSwitch = await ctx.db
      .query("loanSwitch")
      .withIndex("by_userId_and_status", (q) =>
        q.eq("userId", identity.subject).eq("status", "pending"),
      )
      .order("desc")
      .first();

    if (!activeLoanSwitch) {
      return null;
    }

    // Get the loan offer details for the name
    const loanOffer = await ctx.db.get(activeLoanSwitch.targetOfferId);
    if (!loanOffer) {
      return null;
    }

    return {
      ...activeLoanSwitch,
      targetLoanName: loanOffer.name,
    };
  },
});

/**
 * Get all loan switches for a user (for history)
 */
export const getUserLoanSwitches = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("loanSwitch"),
      _creationTime: v.number(),
      userId: v.string(),
      targetOfferId: v.id("principalMortgageOffers"),
      status: v.union(
        v.literal("pending"),
        v.literal("cancelled"),
        v.literal("completed"),
      ),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const loanSwitches = await ctx.db
      .query("loanSwitch")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return loanSwitches;
  },
});

/**
 * Start a loan switch request
 */
export const startLoanSwitch = mutation({
  args: {
    targetOfferId: v.id("principalMortgageOffers"),
  },
  returns: v.id("loanSwitch"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Validate that the loan offer exists
    const loanOffer = await ctx.db.get(args.targetOfferId);
    if (!loanOffer) {
      throw new Error("Loan offer not found");
    }

    // Check if there's already an active loan switch
    const existingSwitch = await ctx.db
      .query("loanSwitch")
      .withIndex("by_userId_and_status", (q) =>
        q.eq("userId", identity.subject).eq("status", "pending"),
      )
      .first();

    if (existingSwitch) {
      // Cancel the existing switch first
      await ctx.db.patch(existingSwitch._id, {
        status: "cancelled",
      });
    }

    const loanSwitchId = await ctx.db.insert("loanSwitch", {
      userId: identity.subject,
      targetOfferId: args.targetOfferId,
      status: "pending",
    });

    return loanSwitchId;
  },
});

/**
 * Cancel an active loan switch
 */
export const cancelLoanSwitch = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Find the active loan switch
    const activeLoanSwitch = await ctx.db
      .query("loanSwitch")
      .withIndex("by_userId_and_status", (q) =>
        q.eq("userId", identity.subject).eq("status", "pending"),
      )
      .first();

    if (!activeLoanSwitch) {
      throw new Error("No active loan switch found");
    }

    // Update status to cancelled
    await ctx.db.patch(activeLoanSwitch._id, {
      status: "cancelled",
    });

    return null;
  },
});

/**
 * Check if a specific loan offer has an active switch
 */
export const isLoanSwitchActive = query({
  args: {
    targetOfferId: v.id("principalMortgageOffers"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const activeSwitch = await ctx.db
      .query("loanSwitch")
      .withIndex("by_userId_and_status", (q) =>
        q.eq("userId", identity.subject).eq("status", "pending"),
      )
      .filter((q) => q.eq(q.field("targetOfferId"), args.targetOfferId))
      .first();

    return activeSwitch !== null;
  },
});
