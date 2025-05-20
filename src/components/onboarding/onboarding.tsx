"use client";

import {
  BankOnboarding,
  BankOnboardingFormSchema,
} from "@/components/onboarding/bank-onboarding";
import { Button } from "@/components/ui/button";
import { parseAsInteger, parseAsJson, useQueryState } from "nuqs";
import { UnionOnboarding, UnionOnboardingFormSchema } from "./union-onboarding";
import {
  LoanDetailsFormSchema,
  UserLoanDetails,
  loanDetailsSchema,
} from "./user-loan-details";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1));
  const [bank, setBank] = useQueryState("bank");
  const [loanDetails, setLoanDetails] = useQueryState(
    "loanDetails",
    parseAsJson(loanDetailsSchema.parse),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveLoanDetails = useMutation(api.onboarding.saveUserLoanDetails);

  const handleBankSubmit = (data: BankOnboardingFormSchema) => {
    setBank(data.bank);
    setStep(2, { scroll: true });
  };

  const handleLoanExplenationSubmit = () => {
    setStep(3, { scroll: true });
  };

  const handleLoanDetailsSubmit = (data: LoanDetailsFormSchema) => {
    setLoanDetails(data);
    setStep(4, { scroll: true });
  };

  const handleUnionSubmit = async ({ union }: UnionOnboardingFormSchema) => {
    if (bank && union && loanDetails) {
      // Construct the data for the mutation based on loanDetails
      // The mutation api.onboarding.saveUserLoanDetails expects:
      // { name: string, amount: number, nominalRate: number, termYears: number }
      const mutationData = {
        name: loanDetails.loanName,
        amount: loanDetails.loanAmount,
        nominalRate: loanDetails.nominalRate,
        termYears: loanDetails.termYears,
      };
      setIsLoading(true);
      setError(null);
      try {
        await saveLoanDetails(mutationData);
        router.push("/loans");
      } catch (e) {
        console.error("Failed to save loan details:", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Step 1: The user needs to select a bank
  if (!bank) {
    return <BankOnboarding onSubmit={handleBankSubmit} />;
  }

  // Step 2: Explain the loan details
  if (step === 2) {
    return <LoanDetailsExplenation onSubmit={handleLoanExplenationSubmit} />;
  }

  // Step 3: The user needs to enter their loan details
  if (step === 3) {
    return <UserLoanDetails onSubmit={handleLoanDetailsSubmit} />;
  }

  // Step 4: The user needs to select a union
  // Consider disabling the button in UnionOnboarding if isLoading is true
  return (
    <UnionOnboarding
      onSubmit={handleUnionSubmit}
      isLoading={isLoading}
      errorMessage={error}
    />
  );
}

function LoanDetailsExplenation({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 text-center">
      <h3 className="text-2xl font-semibold">Steg 2 av 4</h3>
      <h1 className="text-6xl font-bold italic">Info om ditt boliglån</h1>
      <p className="pb-4 text-center text-xl font-semibold">
        Slik finner du det i DNB:
      </p>
      <ol className="list-inside list-decimal space-y-2 text-xl">
        <li>Logg inn i nettbanken og gå i menyen øverst</li>
        <li className="text-xl">
          Trykk på <span className="underline">se mine lån</span> &gt;{" "}
          <span className="underline">boliglån</span> &gt;{" "}
          <span className="underline">se info</span>
        </li>
      </ol>
      <p className="text-xl font-semibold">
        Ta skjermbilde av dette og last det opp til oss i neste steg.
      </p>
      <Button onClick={onSubmit}>Gå videre</Button>
    </div>
  );
}
