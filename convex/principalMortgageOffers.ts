import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a single principal mortgage offer
 */
export const createOffer = mutation({
  args: {
    id: v.string(),
    bankId: v.string(),
    name: v.string(),
    nominalRate: v.number(),
    effectiveRate: v.number(),
    type: v.string(),
    requireMembership: v.boolean(),
    union: v.optional(v.string()),
    requirePackage: v.boolean(),
  },
  returns: v.id("principalMortgageOffers"),
  handler: async (ctx, args) => {
    // Check if offer with this id already exists
    const existingOffer = await ctx.db
      .query("principalMortgageOffers")
      .withIndex("by_offerId")
      .filter((q) => q.eq(q.field("id"), args.id))
      .unique();

    if (existingOffer) {
      throw new Error(`Offer with id "${args.id}" already exists`);
    }

    // Find the bank by bankId to get the reference
    const bank = await ctx.db
      .query("bank")
      .filter((q) => q.eq(q.field("bankId"), args.bankId))
      .unique();

    if (!bank) {
      throw new Error(`Bank with bankId "${args.bankId}" not found`);
    }

    return await ctx.db.insert("principalMortgageOffers", {
      id: args.id,
      bankId: bank._id, // Use the Convex document ID as reference
      name: args.name,
      nominalRate: args.nominalRate,
      effectiveRate: args.effectiveRate,
      type: args.type,
      requireMembership: args.requireMembership,
      union: args.union,
      requirePackage: args.requirePackage,
    });
  },
});

/**
 * Import multiple principal mortgage offers from JSON data
 */
export const importOffers = internalMutation({
  args: {
    offers: v.array(
      v.object({
        id: v.string(),
        bankId: v.string(),
        name: v.string(),
        nominalRate: v.number(),
        effectiveRate: v.number(),
        type: v.string(),
        requireMembership: v.boolean(),
        union: v.optional(v.string()),
        requirePackage: v.boolean(),
      }),
    ),
  },
  returns: v.object({
    inserted: v.array(v.id("principalMortgageOffers")),
    skipped: v.array(v.string()),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const insertedIds = [];
    const skippedIds = [];
    const errors = [];

    // Pre-load all banks for efficient lookup
    const allBanks = await ctx.db.query("bank").collect();
    const bankLookup = new Map();
    for (const bank of allBanks) {
      bankLookup.set(bank.bankId, bank._id);
    }

    for (const offer of args.offers) {
      try {
        // Check if offer with this id already exists
        const existingOffer = await ctx.db
          .query("principalMortgageOffers")
          .withIndex("by_offerId")
          .filter((q) => q.eq(q.field("id"), offer.id))
          .unique();

        if (existingOffer) {
          skippedIds.push(offer.id);
          continue;
        }

        // Find the bank reference
        const bankDocId = bankLookup.get(offer.bankId);
        if (!bankDocId) {
          errors.push(
            `Bank with bankId "${offer.bankId}" not found for offer "${offer.id}"`,
          );
          continue;
        }

        const offerId = await ctx.db.insert("principalMortgageOffers", {
          id: offer.id,
          bankId: bankDocId, // Use the Convex document ID as reference
          name: offer.name,
          nominalRate: offer.nominalRate,
          effectiveRate: offer.effectiveRate,
          type: offer.type,
          requireMembership: offer.requireMembership,
          union: offer.union,
          requirePackage: offer.requirePackage,
        });
        insertedIds.push(offerId);
      } catch (error) {
        errors.push(`Error importing offer "${offer.id}": ${error}`);
      }
    }

    return {
      inserted: insertedIds,
      skipped: skippedIds,
      errors: errors,
    };
  },
});

/**
 * Get all principal mortgage offers with bank information
 */
export const getAllOffers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("principalMortgageOffers"),
      _creationTime: v.number(),
      id: v.string(),
      bankId: v.id("bank"),
      name: v.string(),
      nominalRate: v.number(),
      effectiveRate: v.number(),
      type: v.string(),
      requireMembership: v.boolean(),
      union: v.optional(v.string()),
      requirePackage: v.boolean(),
      bank: v.object({
        _id: v.id("bank"),
        name: v.string(),
        url: v.string(),
        bankId: v.string(),
      }),
    }),
  ),
  handler: async (ctx) => {
    const offers = await ctx.db.query("principalMortgageOffers").collect();

    const enrichedOffers = [];
    for (const offer of offers) {
      const bank = await ctx.db.get(offer.bankId);
      if (bank) {
        enrichedOffers.push({
          ...offer,
          bank: bank,
        });
      }
    }

    return enrichedOffers;
  },
});

/**
 * Get offers by bank
 */
export const getOffersByBank = query({
  args: {
    bankId: v.id("bank"),
  },
  returns: v.array(
    v.object({
      _id: v.id("principalMortgageOffers"),
      _creationTime: v.number(),
      id: v.string(),
      bankId: v.id("bank"),
      name: v.string(),
      nominalRate: v.number(),
      effectiveRate: v.number(),
      type: v.string(),
      requireMembership: v.boolean(),
      union: v.optional(v.string()),
      requirePackage: v.boolean(),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("principalMortgageOffers")
      .filter((q) => q.eq(q.field("bankId"), args.bankId))
      .collect();
  },
});

/**
 * Get a specific offer by its custom id
 */
export const getOfferById = query({
  args: {
    id: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("principalMortgageOffers"),
      _creationTime: v.number(),
      id: v.string(),
      bankId: v.id("bank"),
      name: v.string(),
      nominalRate: v.number(),
      effectiveRate: v.number(),
      type: v.string(),
      requireMembership: v.boolean(),
      union: v.optional(v.string()),
      requirePackage: v.boolean(),
      bank: v.object({
        _id: v.id("bank"),
        name: v.string(),
        url: v.string(),
        bankId: v.string(),
      }),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const offer = await ctx.db
      .query("principalMortgageOffers")
      .withIndex("by_offerId")
      .filter((q) => q.eq(q.field("id"), args.id))
      .unique();

    if (!offer) {
      return null;
    }

    const bank = await ctx.db.get(offer.bankId);
    if (!bank) {
      throw new Error(`Bank not found for offer ${args.id}`);
    }

    return {
      ...offer,
      bank: bank,
    };
  },
});

/**
 * Search offers by criteria
 */
export const searchOffers = query({
  args: {
    maxNominalRate: v.optional(v.number()),
    maxEffectiveRate: v.optional(v.number()),
    type: v.optional(v.string()),
    requireMembership: v.optional(v.boolean()),
    requirePackage: v.optional(v.boolean()),
  },
  returns: v.array(
    v.object({
      _id: v.id("principalMortgageOffers"),
      _creationTime: v.number(),
      id: v.string(),
      bankId: v.id("bank"),
      name: v.string(),
      nominalRate: v.number(),
      effectiveRate: v.number(),
      type: v.string(),
      requireMembership: v.boolean(),
      union: v.optional(v.string()),
      requirePackage: v.boolean(),
      bank: v.object({
        _id: v.id("bank"),
        name: v.string(),
        url: v.string(),
        bankId: v.string(),
      }),
    }),
  ),
  handler: async (ctx, args) => {
    let query = ctx.db.query("principalMortgageOffers");

    // Apply filters
    if (args.maxNominalRate !== undefined) {
      query = query.filter((q) =>
        q.lte(q.field("nominalRate"), args.maxNominalRate!),
      );
    }
    if (args.maxEffectiveRate !== undefined) {
      query = query.filter((q) =>
        q.lte(q.field("effectiveRate"), args.maxEffectiveRate!),
      );
    }
    if (args.type !== undefined) {
      query = query.filter((q) => q.eq(q.field("type"), args.type!));
    }
    if (args.requireMembership !== undefined) {
      query = query.filter((q) =>
        q.eq(q.field("requireMembership"), args.requireMembership!),
      );
    }
    if (args.requirePackage !== undefined) {
      query = query.filter((q) =>
        q.eq(q.field("requirePackage"), args.requirePackage!),
      );
    }

    const offers = await query.collect();

    const enrichedOffers = [];
    for (const offer of offers) {
      const bank = await ctx.db.get(offer.bankId);
      if (bank) {
        enrichedOffers.push({
          ...offer,
          bank: bank,
        });
      }
    }

    return enrichedOffers;
  },
});

/**
 * Delete all offers (useful for re-importing clean data)
 */
export const clearAllOffers = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const offers = await ctx.db.query("principalMortgageOffers").collect();

    for (const offer of offers) {
      await ctx.db.delete(offer._id);
    }

    return null;
  },
});
