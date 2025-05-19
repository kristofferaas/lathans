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
import { db } from "@/server/db";
import { principalMortgageOffers, userLoanDetails } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Suspense } from "react";

export default function LoansPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex flex-col items-start sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-foreground mb-1 text-4xl font-bold italic sm:mb-0 md:text-5xl">
            Min boliglånsliste
          </h1>
          <p className="text-muted-foreground mt-8 text-xs whitespace-nowrap sm:mt-auto">
            Sist oppdatert: 08:12:45 23.mai 2025
          </p>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Hei Petter! Her finner du listen med de lånene som er mest og minst
          gunstige for deg. De i grønt er hva du kan spare årlig, det i grått er
          ditt nåværende lån og det i rødt må du absolutt ikke velge.
        </p>
        <Alert>
          <AlertTitle>Automatisk matching!</AlertTitle>
          <AlertDescription>
            Når du bytter så sender vi også forespørsel til din nåværende bank
            om å matche tilbudet.
          </AlertDescription>
        </Alert>
        <Suspense fallback={<LoansLoading />}>
          <LoansList />
        </Suspense>
      </div>
    </main>
  );
}

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

function createComparisonLoans(
  offers: (typeof principalMortgageOffers.$inferSelect)[],
  userLoan: typeof userLoanDetails.$inferSelect,
): ComparisonLoan[] {
  const userActualYearlyPayment = calculateYearlyFixedRateMortgagePayment(
    userLoan.amount,
    userLoan.nominalRate / 12,
    userLoan.termYears,
  );

  const comparisonLoans: ComparisonLoan[] = [
    {
      ...userLoan,
      isCurrentDeal: true,
      annualDifference: 0,
      actualYearlyPayment: userActualYearlyPayment,
    },
    ...offers.map((offer) => {
      const offerActualYearlyPayment = calculateYearlyFixedRateMortgagePayment(
        userLoan.amount,
        offer.nominalRate / 12,
        userLoan.termYears,
      );
      return {
        isCurrentDeal: false,
        annualDifference: offerActualYearlyPayment - userActualYearlyPayment,
        id: offer.id,
        name: offer.name,
        nominalRate: offer.nominalRate,
        termYears: userLoan.termYears,
        amount: userLoan.amount,
        actualYearlyPayment: offerActualYearlyPayment,
      };
    }),
  ];

  return comparisonLoans.sort(
    (a, b) => a.annualDifference - b.annualDifference,
  );
}

async function LoansList() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const userLoan = await db.query.userLoanDetails.findFirst({
    where: eq(userLoanDetails.clerkUserId, userId),
  });

  if (!userLoan) {
    throw new Error("User loan not found");
  }

  const principalMortgageOffers =
    await db.query.principalMortgageOffers.findMany();

  const comparisonLoans = createComparisonLoans(
    principalMortgageOffers,
    userLoan,
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
              <p className="text-muted-foreground overflow-hidden text-sm font-normal text-ellipsis whitespace-nowrap md:text-base">
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
              {/* <DetailItem
                label="Effektiv rente"
                value={offer.effectiveRate}
                type="rate"
              />
              <DetailItem
                label="Total månedlig betaling"
                value={offer.totalMonthlyPayment}
                type="currency"
              /> */}
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
              {/* <DetailItem
                label="Terminbeløp uten renter"
                value={offer.principalPayment}
                type="currency"
              /> */}
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

function LoansLoading() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div>
            <Skeleton className="mb-1.5 h-5 w-20" /> {/* Rank */}
            <Skeleton className="h-4 w-48" /> {/* Description */}
          </div>
          <Skeleton className="h-8 w-28 rounded-full" /> {/* Badge */}
        </div>
      ))}
    </div>
  );
}

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
  return result || "0 mnd"; // Handle case where totalYears is 0 or very small
};

// formatCurrency for annualDifference (already existing, but slightly adapted for clarity)
const formatCurrency = (value: number) => {
  const prefix = value > 0 ? "+ " : value < 0 ? "- " : "";
  const numStr = Math.abs(value).toLocaleString("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${prefix}${numStr} kr/år`;
};

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
      case "string": // Fallback for any unexpected string types if needed, or plain numbers
        displayValue = String(value);
        break;
    }
  }

  return (
    <div className="px-1 py-3 text-center">
      <p className="text-sm font-semibold text-gray-800 md:text-base">
        {displayValue}
      </p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
};
