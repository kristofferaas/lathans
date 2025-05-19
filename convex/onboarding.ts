import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveUserLoanDetails = mutation({
  args: {
    name: v.string(),
    amount: v.number(),
    nominalRate: v.number(),
    termYears: v.number(),
  },
  returns: v.id("userLoanDetails"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User is not authenticated");
    }

    const loanDetailId = await ctx.db.insert("userLoanDetails", {
      clerkUserId: identity.subject,
      name: args.name,
      amount: args.amount,
      nominalRate: args.nominalRate,
      termYears: args.termYears,
    });
    return loanDetailId;
  },
});
