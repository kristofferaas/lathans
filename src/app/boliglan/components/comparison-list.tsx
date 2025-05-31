"use client";

import { Badge } from "@/components/loan-list/badge";
import { DetailItem, Details } from "@/components/loan-list/details";
import {
  LoanContent,
  LoanItem,
  Loans,
  LoanTrigger,
} from "@/components/loan-list/loan-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

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

// Loan Comparison Item Component
interface LoanComparisonItemProps {
  offer: {
    id: string;
    name: string;
    bankName: string;
    isCurrentDeal: boolean;
    annualDifference: number;
    nominalRate?: number;
    effectiveRate?: number;
    termYears?: number;
    amount?: number;
    actualYearlyPayment: number;
  };
  index: number;
}

function LoanComparisonItem({ offer, index }: LoanComparisonItemProps) {
  return (
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Bytt til dette lånet</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Er du sikker på at du vil bytte til dette lånet?
              </DialogTitle>
              <DialogDescription>
                Vi vil kontakte banken og bytte automatisk for deg. Du trenger
                ikke gjøre noe, og kan når som helst avbryte prosessen.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex sm:justify-between">
              <DialogClose asChild>
                <Button variant="outline">Avbryt</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button asChild>
                  <Link href={`/gratulerer`}>
                    Ja, jeg vil bytte til dette lånet
                  </Link>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </LoanContent>
    </LoanItem>
  );
}

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
        <LoanComparisonItem key={offer.id} offer={offer} index={index} />
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
