import {
  Onboarding,
  OnboardingAction,
} from "@/components/onboarding/onboarding";
import { db } from "@/server/db";
import { userLoanDetails } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const onboardingAction: OnboardingAction = async (data) => {
  "use server";
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  await db.insert(userLoanDetails).values({
    clerkUserId: userId,
    name: data.loanName,
    amount: data.loanAmount,
    nominalRate: data.nominalRate,
    termYears: data.termYears,
  });

  redirect("/loans");
};

export default function Home() {
  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto mt-16 mb-48 max-w-3xl">
        <Suspense fallback={<div>Loading...</div>}>
          <Onboarding action={onboardingAction} />
        </Suspense>
      </div>
    </main>
  );
}
