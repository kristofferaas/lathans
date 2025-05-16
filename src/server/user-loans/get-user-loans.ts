import { db } from "@/server/db";
import { userLoanDetails } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getUserLoans() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const userLoans = await db
    .select()
    .from(userLoanDetails)
    .where(eq(userLoanDetails.clerkUserId, userId));

  return userLoans;
}
