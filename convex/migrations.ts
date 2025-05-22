import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Define an interface for the structure of old userLoanDetails documents.
// This is for type safety within this migration script, as the table
// is no longer formally defined in schema.ts.
interface OldUserLoanDetail {
  _id: any; // Convex Id as string
  _creationTime: number;
  clerkUserId: string;
  name: string;
  amount: number;
  nominalRate: number;
  termYears: number;
  // Ensure all fields that existed in your userLoanDetails documents are listed here
  // if they need to be accessed or if you want stricter type checking.
}

export const migrateUserLoanDetailsToUserLoan = internalMutation({
  args: {},
  // Returns a summary of the migration.
  returns: v.object({
    totalScannedInOldTable: v.number(),
    migratedCount: v.number(),
    skippedCount: v.number(), // Count of records already found in the new table
  }),
  handler: async (ctx) => {
    console.log("Starting migration from userLoanDetails to userLoan...");

    // Fetch all documents from the old userLoanDetails table.
    // As it's not in the schema, items will be of a less specific type.
    // Use `as any` to bypass strict schema check for the old table.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const oldDetails = await (ctx.db as any).query("userLoanDetails").collect();
    console.log(`Found ${oldDetails.length} documents in userLoanDetails.`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const oldDoc of oldDetails as OldUserLoanDetail[]) {
      // Defensive check for essential field
      if (!oldDoc.clerkUserId) {
        console.warn(
          `Skipping document with _id ${oldDoc._id} due to missing clerkUserId.`,
        );
        skippedCount++;
        continue;
      }

      // Check if a userLoan document already exists for this userId to make the migration idempotent.
      const existingUserLoan = await ctx.db
        .query("userLoan")
        .withIndex("by_userId", (q) => q.eq("userId", oldDoc.clerkUserId))
        .first();

      if (existingUserLoan) {
        skippedCount++;
        console.log(
          `Skipping migration for userId ${oldDoc.clerkUserId}: userLoan already exists with _id ${existingUserLoan._id}.`,
        );
        continue;
      }

      // Map fields from old schema to new schema and insert into userLoan.
      try {
        await ctx.db.insert("userLoan", {
          userId: oldDoc.clerkUserId,
          loanName: oldDoc.name, // 'name' from old table maps to 'loanName'
          loanAmount: oldDoc.amount, // 'amount' from old table maps to 'loanAmount'
          nominalRate: oldDoc.nominalRate,
          termYears: oldDoc.termYears,
          // Optional fields in userLoan (bank, screenshotStorageId, union)
          // will not be set if they weren't in userLoanDetails, which is fine.
        });
        migratedCount++;
        console.log(
          `Successfully migrated userLoan for userId ${oldDoc.clerkUserId}.`,
        );
      } catch (error) {
        console.error(
          `Failed to migrate document for clerkUserId ${oldDoc.clerkUserId} (original _id ${oldDoc._id}):`,
          error,
        );
        // Depending on the error, you might want to increment skippedCount or handle differently
      }
    }

    const summary = {
      totalScannedInOldTable: oldDetails.length,
      migratedCount,
      skippedCount,
    };
    console.log("Migration from userLoanDetails to userLoan completed.");
    console.log("Migration summary:", summary);
    return summary; // Ensure the summary is returned to match the 'returns' validator
  },
});

// You can add other migration scripts here if needed in the future.
