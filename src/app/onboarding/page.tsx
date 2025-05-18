import {
  Onboarding,
  OnboardingAction,
} from "@/components/onboarding/onboarding";
import { db } from "@/server/db";
import { loanDetails } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const onboardingAction: OnboardingAction = async (data) => {
  "use server";
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  await db.insert(loanDetails).values({
    loanName: data.loanName,
    loanAmount: data.loanAmount.toString(),
    nominalRate: data.nominalRate.toString(),
    effectiveRate: data.effectiveRate.toString(),
    monthlyPayment: data.monthlyPayment.toString(),
    installment: data.installment.toString(),
    interest: data.interest.toString(),
    fees: data.fees.toString(),
  });

  redirect("/loans");
};

export default function Home() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto mt-16 mb-48">
        <Suspense fallback={<div>Loading...</div>}>
          <Onboarding action={onboardingAction} />
        </Suspense>
      </div>
    </main>
  );
}
