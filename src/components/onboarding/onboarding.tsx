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

type OnboardingActionData = BankOnboardingFormSchema &
  UnionOnboardingFormSchema &
  LoanDetailsFormSchema;

export type OnboardingAction = (data: OnboardingActionData) => void;

export function Onboarding({ action }: { action: OnboardingAction }) {
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1));
  const [bank, setBank] = useQueryState("bank");
  const [loanDetails, setLoanDetails] = useQueryState(
    "loanDetails",
    parseAsJson(loanDetailsSchema.parse)
  );

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

  const handleUnionSubmit = ({ union }: UnionOnboardingFormSchema) => {
    if (bank && union && loanDetails) {
      const data: OnboardingActionData = {
        union,
        bank: bank as BankOnboardingFormSchema["bank"],
        ...loanDetails,
      };
      action(data);
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
  return <UnionOnboarding onSubmit={handleUnionSubmit} />;
}

function LoanDetailsExplenation({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center text-center max-w-2xl mx-auto">
      <h3 className="font-semibold text-2xl">Steg 2 av 4</h3>
      <h1 className="text-6xl font-bold italic">Info om ditt boliglån</h1>
      <p className="text-center pb-4 text-xl font-semibold">
        Slik finner du det i DNB:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-xl ">
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
