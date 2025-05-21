import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userLoanDetails: defineTable({
    clerkUserId: v.string(),
    name: v.string(),
    amount: v.number(),
    nominalRate: v.number(),
    termYears: v.number(),
  }).index("by_clerkUserId", ["clerkUserId"]),

  principalMortgageOffers: defineTable({
    name: v.string(),
    nominalRate: v.number(),
    // Add any other fields that principalMortgageOffers might have from your Drizzle schema
    // For now, these are the ones visibly used in createComparisonLoans for offer-specific data
  }),

  userLoan: defineTable({
    userId: v.string(),
    bank: v.optional(v.string()),
    screenshotStorageId: v.optional(v.id("_storage")),
    loanName: v.optional(v.string()),
    loanAmount: v.optional(v.number()),
    nominalRate: v.optional(v.number()),
    termYears: v.optional(v.number()),
    union: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
});
