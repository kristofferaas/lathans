import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const uploadUrl = await ctx.storage.generateUploadUrl();
    return uploadUrl;
  },
});

// You might also want a mutation to save the storageId to a document later.
// For example, if you have a 'userProfiles' table:
/*
export const saveScreenshotStorageId = mutation({
  args: { userId: v.id("users"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { screenshotStorageId: args.storageId });
    return null;
  },
});
*/
