"use client";

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
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { UserLoanDetails } from "./user-loan-details";

export function Onboarding() {
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1));
  const [bank, setBank] = useQueryState("bank");
  const router = useRouter();

  const handleBankSubmit = (data: BankOnboardingFormSchema) => {
    setBank(data.bank, { scroll: true });
    setStep(2);
  };

  // Step 1: The user needs to select a bank
  if (!bank) {
    return <BankOnboarding onSubmit={handleBankSubmit} />;
  }

  // Step 2: Explain the loan details
  if (step === 2) {
    return <LoanDetailsExplenation onSubmit={() => setStep(3)} />;
  }

  // Step 3: The user needs to enter their loan details
  if (step === 3) {
    return <UserLoanDetails onSubmit={() => setStep(4)} />;
  }

  // Step 4: The user needs to select a union
  return <UnionDetailsStep onSubmit={() => router.push("/loans")} />;
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

function UnionDetailsStep({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center max-w-2xl mx-auto">
      <h3 className="font-semibold text-2xl">Steg 4 av 4</h3>
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
      <Button onClick={onSubmit}>Gå videre</Button>
    </div>
  );
}
