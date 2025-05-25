import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a single bank record
 */
export const createBank = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    bankId: v.string(),
  },
  returns: v.id("bank"),
  handler: async (ctx, args) => {
    // Check if bank with this bankId already exists
    const existingBank = await ctx.db
      .query("bank")
      .filter((q) => q.eq(q.field("bankId"), args.bankId))
      .first();

    if (existingBank) {
      throw new Error(`Bank with bankId "${args.bankId}" already exists`);
    }

    return await ctx.db.insert("bank", {
      name: args.name,
      url: args.url,
      bankId: args.bankId,
    });
  },
});

/**
 * Import multiple banks from JSON data
 * Expected format: Array of {name: string, url: string, id: string}
 */
export const importBanks = internalMutation({
  args: {
    banks: v.array(
      v.object({
        name: v.string(),
        url: v.string(),
        bankId: v.string(),
      }),
    ),
  },
  returns: v.array(v.id("bank")),
  handler: async (ctx, args) => {
    const insertedIds = [];

    for (const bank of args.banks) {
      // Check if bank with this bankId already exists
      const existingBank = await ctx.db
        .query("bank")
        .filter((q) => q.eq(q.field("bankId"), bank.bankId))
        .first();

      if (!existingBank) {
        const bankId = await ctx.db.insert("bank", {
          name: bank.name,
          url: bank.url,
          bankId: bank.bankId,
        });
        insertedIds.push(bankId);
      }
    }

    return insertedIds;
  },
});

/**
 * Get all banks
 */
export const getAllBanks = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("bank"),
      _creationTime: v.number(),
      name: v.string(),
      url: v.string(),
      bankId: v.string(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("bank").collect();
  },
});

/**
 * Get a bank by its custom bankId
 */
export const getBankById = query({
  args: {
    bankId: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("bank"),
      _creationTime: v.number(),
      name: v.string(),
      url: v.string(),
      bankId: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bank")
      .filter((q) => q.eq(q.field("bankId"), args.bankId))
      .first();
  },
});

/**
 * Delete all banks (useful for re-importing clean data)
 */
export const clearAllBanks = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const banks = await ctx.db.query("bank").collect();

    for (const bank of banks) {
      await ctx.db.delete(bank._id);
    }

    return null;
  },
});
