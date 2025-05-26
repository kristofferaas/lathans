import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  principalMortgageOffers: defineTable({
    name: v.string(),
    nominalRate: v.number(),
    id: v.string(),
    bankId: v.id("bank"),
    effectiveRate: v.number(),
    type: v.string(),
    requireMembership: v.boolean(),
    union: v.optional(v.string()),
    requirePackage: v.boolean(),
  }).index("by_offerId", ["id"]),

  bank: defineTable({
    name: v.string(),
    url: v.string(),
    bankId: v.string(),
  }).index("by_bank_id", ["bankId"]),

  userLoan: defineTable({
    userId: v.string(),
    bank: v.optional(v.string()),
    screenshotStorageId: v.optional(v.id("_storage")),
    loanName: v.optional(v.string()),
    loanAmount: v.optional(v.number()),
    nominalRate: v.optional(v.number()),
    effectiveRate: v.optional(v.number()),
    termYears: v.optional(v.number()),
    union: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
});
