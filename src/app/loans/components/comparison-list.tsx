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
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { Details, DetailItem } from "../../../components/loan-list/details";
import { Badge } from "../../../components/loan-list/badge";

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
    value.toLocaleString("nb-NO", {
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

export function ComparisonList() {
  const { userId, isLoaded: authIsLoaded } = useAuth();

  const comparisons = useQuery(
    api.comparison.getLoanComparison,
    userId ? {} : "skip",
  );

  if (!authIsLoaded || comparisons === undefined) {
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

  if (comparisons === null) {
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

  return (
    <Loans type="single" collapsible>
      {comparisons.map((offer, index) => (
        <LoanItem value={offer.id} key={offer.id}>
          <LoanTrigger>
            <div className="min-w-0 flex-grow text-left">
              <p className="text-secondary-foreground text-lg font-semibold">
                {index + 1}. {offer.name}
              </p>
              <p className="text-muted-foreground text_ellipsis overflow-hidden text-sm font-normal whitespace-nowrap md:text-base">
                {offer.bankName}
              </p>
            </div>
            <Badge
              variant={
                offer.isCurrentDeal
                  ? "gray"
                  : offer.annualDifference < 0
                    ? "green"
                    : "red"
              }
            >
              {offer.isCurrentDeal
                ? "Min avtale"
                : formatCurrency(offer.annualDifference)}
            </Badge>
          </LoanTrigger>
          <LoanContent>
            <Details>
              <DetailItem
                label="Nominell rente"
                value={formatDisplayRate(offer.nominalRate)}
              />
              <DetailItem
                label="Effektiv rente"
                value={formatDisplayRate(offer.effectiveRate)}
              />
              <DetailItem
                label="Nedbetalingstid"
                value={formatDisplayTime(offer.termYears)}
              />
              <DetailItem
                label="Totalt lånebeløp"
                value={formatDisplayCurrency(offer.amount)}
              />
              <DetailItem
                label="Total månedlig betaling"
                value={formatDisplayCurrency(offer.actualYearlyPayment / 12)}
              />
              <DetailItem
                label="Total årlig betaling"
                value={formatDisplayCurrency(offer.actualYearlyPayment)}
              />
            </Details>
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
    <Loans type="single" collapsible>
      {[1, 2, 3, 4, 5].map((i) => (
        <LoanItem
          value={`loading-${i}`}
          key={i}
          className="flex items-center justify-between p-5"
        >
          <div className="min-w-0 flex-grow text-left">
            <p className="text-secondary-foreground text-lg font-semibold">
              {i}. plass
            </p>
            <Skeleton className="mt-2 h-4 w-32 md:w-64" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </LoanItem>
      ))}
    </Loans>
  );
}
