"use client";

import {
  LoanContent,
  LoanItem,
  Loans,
  LoanTrigger,
} from "@/components/loan-list/loan-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateYearlyFixedRateMortgagePayment } from "@/lib/mortgage";
import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";

// Types
type ComparisonLoan = {
  id: string;
  isCurrentDeal: boolean;
  name: string;
  nominalRate: number;
  termYears: number;
  amount: number;
  annualDifference: number;
  actualYearlyPayment: number;
};

type UserLoanDoc = Doc<"userLoan">;
type ValidatedUserLoan = UserLoanDoc & {
  _id: Id<"userLoan">;
  loanName: string;
  loanAmount: number;
  nominalRate: number;
  termYears: number;
};

type PrincipalMortgageOfferDoc = Doc<"principalMortgageOffers">;

// Helper function
function createComparisonLoans(
  offers: PrincipalMortgageOfferDoc[],
  userLoan: ValidatedUserLoan,
): ComparisonLoan[] {
  const userActualYearlyPayment = calculateYearlyFixedRateMortgagePayment(
    userLoan.loanAmount,
    userLoan.nominalRate / 12,
    userLoan.termYears,
  );

  const comparisonLoans: ComparisonLoan[] = [
    {
      id: userLoan._id,
      isCurrentDeal: true,
      name: userLoan.loanName,
      nominalRate: userLoan.nominalRate,
      termYears: userLoan.termYears,
      amount: userLoan.loanAmount,
      annualDifference: 0,
      actualYearlyPayment: userActualYearlyPayment,
    },
    ...offers.map((offer) => {
      const offerActualYearlyPayment = calculateYearlyFixedRateMortgagePayment(
        userLoan.loanAmount,
        offer.nominalRate / 12,
        userLoan.termYears,
      );
      return {
        isCurrentDeal: false,
        annualDifference: offerActualYearlyPayment - userActualYearlyPayment,
        id: offer._id,
        name: offer.name,
        nominalRate: offer.nominalRate,
        termYears: userLoan.termYears,
        amount: userLoan.loanAmount,
        actualYearlyPayment: offerActualYearlyPayment,
      };
    }),
  ];

  return comparisonLoans.sort(
    (a, b) => a.annualDifference - b.annualDifference,
  );
}

// Formatting Utilities
const formatDisplayCurrency = (value?: number) => {
  if (typeof value !== "number") return "N/A";
  return value.toLocaleString("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const formatDisplayRate = (value?: number) => {
  if (typeof value !== "number") return "N/A";
  return (
    (value * 100).toLocaleString("nb-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " %"
  );
};

const formatDisplayTime = (totalYears?: number) => {
  if (typeof totalYears !== "number" || totalYears < 0) return "N/A";
  const years = Math.floor(totalYears);
  const months = Math.round((totalYears - years) * 12);
  let result = "";
  if (years > 0) {
    result += `${years} år`;
  }
  if (months > 0) {
    if (years > 0) result += ", ";
    result += `${months} mnd`;
  }
  return result || "0 mnd";
};

const formatCurrency = (value: number) => {
  const prefix = value > 0 ? "+ " : value < 0 ? "- " : "";
  const numStr = Math.abs(value).toLocaleString("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${prefix}${numStr} kr/år`;
};

// DetailItem Component
interface DetailItemProps {
  label: string;
  value?: number;
  type: "currency" | "rate" | "time" | "string";
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, type }) => {
  let displayValue = "N/A";
  if (value !== undefined) {
    switch (type) {
      case "currency":
        displayValue = formatDisplayCurrency(value);
        break;
      case "rate":
        displayValue = formatDisplayRate(value);
        break;
      case "time":
        displayValue = formatDisplayTime(value);
        break;
      case "string":
        displayValue = String(value);
        break;
    }
  }

  return (
    <div className="px-1 py-3 text-center">
      <p className="text-card-foreground text-sm font-semibold md:text-base">
        {displayValue}
      </p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
};

// Main Client Component
export function LoansList() {
  const { userId, isLoaded: authIsLoaded } = useAuth();

  const userLoanData = useQuery(api.loans.getUserLoan, userId ? {} : "skip");

  const principalMortgageOffers = useQuery(
    api.loans.listPrincipalMortgageOffers,
    userId ? {} : "skip",
  );

  if (
    !authIsLoaded ||
    userLoanData === undefined ||
    principalMortgageOffers === undefined
  ) {
    return <LoansLoading />;
  }

  if (!userId) {
    return (
      <Alert>
        <AlertTitle>Pålogging kreves</AlertTitle>
        <AlertDescription>
          Vennligst logg inn for å se dine lånetilbud.
        </AlertDescription>
      </Alert>
    );
  }

  if (userLoanData === null) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Lånedetaljer mangler</AlertTitle>
        <AlertDescription>
          Vi fant ingen lånedetaljer for deg. Vennligst fullfør onboarding
          prosessen.
        </AlertDescription>
      </Alert>
    );
  }

  if (
    userLoanData.loanName === null ||
    userLoanData.loanName === undefined ||
    userLoanData.loanAmount === null ||
    userLoanData.loanAmount === undefined ||
    userLoanData.nominalRate === null ||
    userLoanData.nominalRate === undefined ||
    userLoanData.termYears === null ||
    userLoanData.termYears === undefined
  ) {
    console.error(
      "User loan data is missing essential fields for comparison.",
      { userLoanData },
    );
    return (
      <Alert variant="destructive">
        <AlertTitle>Ufullstendige Lånedetaljer</AlertTitle>
        <AlertDescription>
          Dine lagrede lånedetaljer mangler nødvendig informasjon (navn, beløp,
          rente, eller løpetid) for å kunne lage en sammenligning.
        </AlertDescription>
      </Alert>
    );
  }

  const validatedUserLoan = userLoanData as ValidatedUserLoan;

  if (!principalMortgageOffers) {
    console.error(
      "Unexpected state: principalMortgageOffers are not available for comparison.",
      { principalMortgageOffers },
    );
    return (
      <Alert variant="destructive">
        <AlertTitle>Feil</AlertTitle>
        <AlertDescription>
          Kunne ikke laste tilbud for sammenligning.
        </AlertDescription>
      </Alert>
    );
  }

  const comparisonLoans = createComparisonLoans(
    principalMortgageOffers,
    validatedUserLoan,
  );

  return (
    <Loans type="single" collapsible>
      {comparisonLoans.map((offer, index) => (
        <LoanItem value={offer.id} key={offer.id}>
          <LoanTrigger>
            <div className="min-w-0 flex-grow text-left">
              <p className="text-secondary-foreground text-lg font-semibold">
                {index + 1}. plass
              </p>
              <p className="text-muted-foreground text_ellipsis overflow-hidden text-sm font-normal whitespace-nowrap md:text-base">
                {offer.name}
              </p>
            </div>
            <div
              className={`ml-4 shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap md:text-sm ${
                offer.isCurrentDeal
                  ? "bg-gray-200 text-gray-700"
                  : offer.annualDifference < 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {offer.isCurrentDeal
                ? "Min avtale"
                : formatCurrency(offer.annualDifference)}
            </div>
          </LoanTrigger>
          <LoanContent>
            <div className="mb-6 grid grid-cols-2 md:grid-cols-3">
              <DetailItem
                label="Nominell rente"
                value={offer.nominalRate}
                type="rate"
              />
              <DetailItem
                label="Nedbetalingstid"
                value={offer.termYears}
                type="time"
              />
              <DetailItem
                label="Totalt lånebeløp"
                value={offer.amount}
                type="currency"
              />
              <DetailItem
                label="Total månedlig betaling"
                value={offer.actualYearlyPayment / 12}
                type="currency"
              />
              <DetailItem
                label="Total årlig betaling"
                value={offer.actualYearlyPayment}
                type="currency"
              />
            </div>
            <Button className="w-full">Bytt til dette lånet</Button>
          </LoanContent>
        </LoanItem>
      ))}
    </Loans>
  );
}

// Loading Skeleton Component
export function LoansLoading() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div>
            <Skeleton className="mb-1.5 h-5 w-20" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      ))}
    </div>
  );
}
