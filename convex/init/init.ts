import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { banks, principalMortgageOffers } from "./data";

/**
 * Seed the database with initial data using the existing import functions.
 * This function is idempotent - safe to run multiple times.
 * It only adds data if the tables are empty.
 */
export default internalMutation({
  args: {},
  returns: v.object({
    banksSeeded: v.number(),
    offersSeeded: v.number(),
    offersSkipped: v.number(),
    offersErrors: v.number(),
    alreadySeeded: v.boolean(),
  }),
  handler: async (ctx) => {
    // Check if data already exists
    const existingBanks = await ctx.db.query("bank").take(1);
    const existingOffers = await ctx.db
      .query("principalMortgageOffers")
      .take(1);

    if (existingBanks.length > 0 || existingOffers.length > 0) {
      console.log("Database already contains data. Skipping seed.");
      return {
        banksSeeded: 0,
        offersSeeded: 0,
        offersSkipped: 0,
        offersErrors: 0,
        alreadySeeded: true,
      };
    }

    console.log("Starting database seeding...");

    // Import banks using the existing importBanks function
    console.log(`Importing ${banks.length} banks...`);
    const bankIds: Id<"bank">[] = await ctx.runMutation(
      internal.bank.importBanks,
      {
        banks,
      },
    );
    console.log(`Successfully imported ${bankIds.length} banks`);

    // Import offers using the existing importOffers function
    console.log(
      `Importing ${principalMortgageOffers.length} mortgage offers...`,
    );
    const offerResults: {
      inserted: Id<"principalMortgageOffers">[];
      skipped: string[];
      errors: string[];
    } = await ctx.runMutation(internal.principalMortgageOffers.importOffers, {
      offers: principalMortgageOffers,
    });

    console.log(`Offers import completed:`);
    console.log(`- Inserted: ${offerResults.inserted.length}`);
    console.log(`- Skipped: ${offerResults.skipped.length}`);
    console.log(`- Errors: ${offerResults.errors.length}`);

    if (offerResults.errors.length > 0) {
      console.warn("Import errors:");
      offerResults.errors.forEach((error: string) =>
        console.warn(`  ${error}`),
      );
    }

    console.log("Database seeding completed successfully!");

    return {
      banksSeeded: bankIds.length,
      offersSeeded: offerResults.inserted.length,
      offersSkipped: offerResults.skipped.length,
      offersErrors: offerResults.errors.length,
      alreadySeeded: false,
    };
  },
});
