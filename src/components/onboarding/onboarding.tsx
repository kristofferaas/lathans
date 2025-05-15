"use client";

import LoanDetailsForm from "@/components/loan-details-form";
import {
  BankOnboarding,
  BankOnboardingFormSchema,
} from "@/components/onboarding/bank-onboarding";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

export function Onboarding() {
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1));
  const [bank, setBank] = useQueryState("bank", { history: "push" });

  const handleBankSubmit = (data: BankOnboardingFormSchema) => {
    setBank(data.bank, { scroll: true });
    setStep(2);
  };

  // Step 1: The user needs to select a bank
  if (step === 1) {
    return <BankOnboarding onSubmit={handleBankSubmit} />;
  }

  // Step 2: Explain the loan details
  if (step === 2) {
    return (
      <LoanDetailsExplenation
        step={step}
        totalSteps={4}
        nextHref="/onboarding?step=3"
      />
    );
  }

  // Step 3: The user needs to enter their loan details
  if (step === 3) {
    return (
      <LoanDetailsStep
        step={step}
        totalSteps={4}
        nextHref="/onboarding?step=4"
      />
    );
  }

  // Step 4: The user needs to select a union
  if (step === 4) {
    return <UnionDetailsStep step={step} totalSteps={4} nextHref="/loans" />;
  }

  return (
    <div>
      <Button asChild>
        <Link href="/loans">Gå til lån</Link>
      </Button>
    </div>
  );
}

type OnboardingStepProps = {
  step: number;
  totalSteps: number;
  nextHref: string;
};

function LoanDetailsExplenation({
  step,
  totalSteps,
  nextHref,
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center text-center max-w-2xl mx-auto">
      <h3 className="font-semibold text-2xl">
        Steg {step} av {totalSteps}
      </h3>
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
      <Button asChild>
        <Link href={nextHref}>Gå videre</Link>
      </Button>
    </div>
  );
}

function LoanDetailsStep({ step, totalSteps, nextHref }: OnboardingStepProps) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center text-center max-w-2xl mx-auto">
      <h3 className="font-semibold text-2xl">
        Steg {step} av {totalSteps}
      </h3>
      <h1 className="text-6xl font-bold italic">Info om ditt boliglån</h1>
      <LoanDetailsForm />
      <Button asChild>
        <Link href={nextHref}>Gå videre</Link>
      </Button>
    </div>
  );
}

function UnionDetailsStep({ step, totalSteps, nextHref }: OnboardingStepProps) {
  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center max-w-2xl mx-auto">
      <h3 className="font-semibold text-2xl">
        Steg {step} av {totalSteps}
      </h3>
      <h1 className="text-6xl font-bold italic">Medlemskap</h1>
      <p className="text-xl font-normal">
        Har du noen medlemskap vi burde vite om for å kunne gi deg de beste
        tilbudene?
      </p>
      <Select>
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Velg" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nito">NITO</SelectItem>
          <SelectItem value="tekna">Tekna</SelectItem>
          <SelectItem value="obos">OBOS</SelectItem>
          <SelectItem value="lo">LO</SelectItem>
          <SelectItem value="akademikerne">Akademikerne</SelectItem>
        </SelectContent>
      </Select>
      <Button asChild>
        <Link href={nextHref}>Gå videre</Link>
      </Button>
    </div>
  );
}
