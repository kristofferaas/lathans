"use client";

import LoanDetailsForm from "@/components/loan-details-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";

export function OnboardingFlow() {
  const [step] = useQueryState("step", parseAsInteger.withDefault(1));

  // Step 1: The user needs to select a bank
  if (step === 1) {
    return <BankDetailsStep nextHref="/onboarding?step=3" />;
  }

  // Step 2: Explain the loan details
  if (step === 2) {
    return <LoanDetailsExplenation nextHref="/onboarding?step=4" />;
  }

  // Step 3: The user needs to enter their loan details
  if (step === 3) {
    return <LoanDetailsStep nextHref="/onboarding?step=4" />;
  }

  // Step 4: The user needs to select a union
  if (step === 4) {
    return <UnionDetailsStep nextHref="/loans" />;
  }

  return (
    <div>
      <Button asChild>
        <Link href="/loans">Gå til lån</Link>
      </Button>
    </div>
  );
}

// function SignInStep({ nextHref }: { nextHref: string }) {
//   const handleSignIn = async () => {
//     await authClient.signIn.oauth2({
//       providerId: "vipps",
//       callbackURL: window.location.origin + nextHref,
//     });
//   };

//   return (
//     <div className="flex flex-col gap-8 items-center justify-center text-center max-w-2xl mx-auto">
//       <h3 className="font-semibold text-2xl">Steg 1 av 5</h3>
//       <h1 className="text-6xl font-bold italic">Logg inn</h1>
//       <p className="text-xl font-normal">
//         Logg inn trygt med Vipps – helt gratis. Dette sikrer både dine data og
//         kontoen din. Ved å logge inn godtar du våre{" "}
//         <Link href="/terms-of-service" className="underline">
//           vilkår
//         </Link>
//         .
//       </p>
//       <Button onClick={handleSignIn} size="lg" className="px-12">
//         Logg inn med Vipps
//       </Button>
//     </div>
//   );
// }

function BankDetailsStep({ nextHref }: { nextHref: string }) {
  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center max-w-2xl mx-auto">
      <h3 className="font-semibold text-2xl">Steg 2 av 5</h3>
      <h1 className="text-6xl font-bold italic">Kom i gang</h1>
      <p className="text-xl font-normal">Hvilken bank har du boliglån i?</p>
      <Select>
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Velg" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nordea">Nordea</SelectItem>
          <SelectItem value="dnb">DNB</SelectItem>
          <SelectItem value="storebrand">Storebrand</SelectItem>
          <SelectItem value="sparebank1">Sparebank 1</SelectItem>
          <SelectItem value="danske-bank">Danske Bank</SelectItem>
        </SelectContent>
      </Select>
      <Button asChild>
        <Link href={nextHref}>Gå videre</Link>
      </Button>
    </div>
  );
}

function LoanDetailsExplenation({ nextHref }: { nextHref: string }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center text-center max-w-2xl mx-auto">
      <h3 className="font-semibold text-2xl">Steg 3 av 5</h3>
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

function LoanDetailsStep({ nextHref }: { nextHref: string }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center text-center max-w-2xl mx-auto">
      <h3 className="font-semibold text-2xl">Steg 4 av 5</h3>
      <h1 className="text-6xl font-bold italic">Info om ditt boliglån</h1>
      <LoanDetailsForm />
      <Button asChild>
        <Link href={nextHref}>Gå videre</Link>
      </Button>
    </div>
  );
}

function UnionDetailsStep({ nextHref }: { nextHref: string }) {
  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center max-w-2xl mx-auto">
      <h3 className="font-semibold text-2xl">Steg 5 av 5</h3>
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
