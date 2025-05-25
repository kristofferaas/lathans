"use strict";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get existing user loan data
export const getUserLoan = query({
  args: {}, // userId will be injected by Convex from auth
  returns: v.union(
    v.object({
      _id: v.id("userLoan"),
      _creationTime: v.number(),
      userId: v.string(),
      bank: v.optional(v.string()),
      screenshotStorageId: v.optional(v.id("_storage")),
      loanName: v.optional(v.string()),
      loanAmount: v.optional(v.number()),
      nominalRate: v.optional(v.number()),
      effectiveRate: v.optional(v.number()),
      termYears: v.optional(v.number()),
      union: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // Not authenticated
      return null;
    }
    const userLoan = await ctx.db
      .query("userLoan")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
    return userLoan;
  },
});

// Mutation to save bank
export const saveBank = mutation({
  args: { bank: v.string() },
  returns: v.id("userLoan"),
  handler: async (ctx, { bank }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    const existingLoan = await ctx.db
      .query("userLoan")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existingLoan) {
      await ctx.db.patch(existingLoan._id, { bank });
      return existingLoan._id;
    } else {
      const newLoanId = await ctx.db.insert("userLoan", {
        userId: identity.subject,
        bank,
      });
      return newLoanId;
    }
  },
});

// Mutation to save screenshot storage ID
export const saveScreenshot = mutation({
  args: { screenshotStorageId: v.optional(v.id("_storage")) },
  returns: v.id("userLoan"),
  handler: async (ctx, { screenshotStorageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    const existingLoan = await ctx.db
      .query("userLoan")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existingLoan) {
      await ctx.db.patch(existingLoan._id, { screenshotStorageId });
      return existingLoan._id;
    } else {
      // This case should ideally not happen if bank is a required first step
      // but handling it defensively.
      const newLoanId = await ctx.db.insert("userLoan", {
        userId: identity.subject,
        screenshotStorageId,
      });
      return newLoanId;
    }
  },
});

// Mutation to save loan details
export const saveLoanDetails = mutation({
  args: {
    loanName: v.string(),
    loanAmount: v.number(),
    nominalRate: v.number(),
    effectiveRate: v.number(),
    termYears: v.number(),
  },
  returns: v.id("userLoan"),
  handler: async (
    ctx,
    { loanName, loanAmount, nominalRate, effectiveRate, termYears },
  ) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    const existingLoan = await ctx.db
      .query("userLoan")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    const details = {
      loanName,
      loanAmount,
      nominalRate,
      effectiveRate,
      termYears,
    };

    if (existingLoan) {
      await ctx.db.patch(existingLoan._id, details);
      return existingLoan._id;
    } else {
      // This case should ideally not happen if bank is a required first step
      const newLoanId = await ctx.db.insert("userLoan", {
        userId: identity.subject,
        ...details,
      });
      return newLoanId;
    }
  },
});

// Mutation to save union
export const saveUnion = mutation({
  args: { union: v.string() },
  returns: v.id("userLoan"),
  handler: async (ctx, { union }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    const existingLoan = await ctx.db
      .query("userLoan")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existingLoan) {
      await ctx.db.patch(existingLoan._id, { union });
      return existingLoan._id;
    } else {
      // This case should ideally not happen if bank is a required first step
      const newLoanId = await ctx.db.insert("userLoan", {
        userId: identity.subject,
        union,
      });
      return newLoanId;
    }
  },
});

// Mutations from former userLoan.ts, adapted for onboarding context
export const saveAnalyzedLoanDetails = mutation({
  args: {
    // userId is derived from identity, not passed as arg
    screenshotStorageId: v.id("_storage"),
    loanName: v.optional(v.string()),
    remainingLoanAmount: v.optional(v.number()),
    nominalInterestRate: v.optional(v.number()),
    effectiveInterestRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        "User not authenticated. Cannot save analyzed loan details.",
      );
    }
    const userId = identity.subject;

    // Check if a loan with this screenshotStorageId already exists for this user
    const existingLoan = await ctx.db
      .query("userLoan")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.eq(q.field("screenshotStorageId"), args.screenshotStorageId),
      )
      .first();

    if (existingLoan) {
      // Update existing loan if found
      await ctx.db.patch(existingLoan._id, {
        loanName: args.loanName,
        loanAmount: args.remainingLoanAmount,
        nominalRate: args.nominalInterestRate,
        effectiveRate: args.effectiveInterestRate,
        screenshotStorageId: args.screenshotStorageId, // ensure screenshotId is also updated/set
      });
      console.log(
        `Updated analyzed loan details for ID: ${existingLoan._id} for user ${userId}`,
      );
      return existingLoan._id;
    } else {
      // If no loan with this specific screenshot exists, check for any loan for the user to patch
      // or create a new one if no loan exists at all for this user.
      const userLoanForPatch = await ctx.db
        .query("userLoan")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();

      if (userLoanForPatch) {
        await ctx.db.patch(userLoanForPatch._id, {
          loanName: args.loanName,
          loanAmount: args.remainingLoanAmount,
          nominalRate: args.nominalInterestRate,
          effectiveRate: args.effectiveInterestRate,
          screenshotStorageId: args.screenshotStorageId,
        });
        console.log(
          `Patched existing user loan ${userLoanForPatch._id} with analyzed details for user ${userId}`,
        );
        return userLoanForPatch._id;
      } else {
        // Insert new loan if not found
        const loanId = await ctx.db.insert("userLoan", {
          userId: userId,
          screenshotStorageId: args.screenshotStorageId,
          loanName: args.loanName,
          loanAmount: args.remainingLoanAmount,
          nominalRate: args.nominalInterestRate,
          effectiveRate: args.effectiveInterestRate,
        });
        console.log(
          `Saved new analyzed loan details with ID: ${loanId} for user ${userId}`,
        );
        return loanId;
      }
    }
  },
});

// This mutation seems more general than just onboarding, but keeping it here as requested.
// It might be better placed in a general userLoan.ts if used outside onboarding.
export const getOrCreateUserLoanForOnboarding = mutation({
  args: {
    // userId derived from identity
    screenshotStorageId: v.optional(v.id("_storage")),
    loanName: v.optional(v.string()),
    loanAmount: v.optional(v.number()),
    nominalRate: v.optional(v.number()),
    effectiveRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated. Cannot get or create loan.");
    }
    const userId = identity.subject;

    const userLoan = await ctx.db
      .query("userLoan")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (userLoan) {
      // User loan exists, patch it with new details if provided
      await ctx.db.patch(userLoan._id, {
        screenshotStorageId:
          args.screenshotStorageId ?? userLoan.screenshotStorageId,
        loanName: args.loanName ?? userLoan.loanName,
        loanAmount: args.loanAmount ?? userLoan.loanAmount,
        nominalRate: args.nominalRate ?? userLoan.nominalRate,
        effectiveRate: args.effectiveRate ?? userLoan.effectiveRate,
      });
      console.log(`Patched loan ${userLoan._id} for user ${userId}`);
      return userLoan._id;
    } else {
      // No user loan exists, create a new one
      const newLoanId = await ctx.db.insert("userLoan", {
        userId: userId,
        screenshotStorageId: args.screenshotStorageId,
        loanName: args.loanName,
        loanAmount: args.loanAmount,
        nominalRate: args.nominalRate,
        effectiveRate: args.effectiveRate,
      });
      console.log(`Created new loan with ID: ${newLoanId} for user ${userId}`);
      return newLoanId;
    }
  },
});
