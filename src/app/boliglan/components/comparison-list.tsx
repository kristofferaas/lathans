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
import { Id } from "@convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

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
  activeLoanSwitch: {
    _id: string;
    _creationTime: number;
    userId: string;
    targetOfferId: string;
    status: "pending" | "cancelled" | "completed";
    targetLoanName: string;
  } | null;
}

function LoanComparisonItem({
  offer,
  index,
  activeLoanSwitch,
}: LoanComparisonItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const startLoanSwitch = useMutation(api.loanSwitch.startLoanSwitch);
  const cancelLoanSwitch = useMutation(api.loanSwitch.cancelLoanSwitch);

  const isCurrentlyBeingSwitched = activeLoanSwitch?.targetOfferId === offer.id;
  const hasActiveSwitchToOtherLoan =
    activeLoanSwitch && !isCurrentlyBeingSwitched;

  const handleStartSwitch = async () => {
    try {
      // For mortgage offers, offer.id is the _id from principalMortgageOffers
      // For the current deal, we skip since it should be disabled
      if (offer.isCurrentDeal) {
        return;
      }

      await startLoanSwitch({
        targetOfferId: offer.id as Id<"principalMortgageOffers">,
      });
      setIsDialogOpen(false);
      router.push("/gratulerer");
    } catch (error) {
      console.error("Failed to start loan switch:", error);
    }
  };

  const handleCancelSwitch = async () => {
    try {
      await cancelLoanSwitch({});
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to cancel loan switch:", error);
    }
  };

  const getBadgeVariantAndText = () => {
    if (offer.isCurrentDeal) {
      return { variant: "gray" as const, text: "Min avtale" };
    }
    if (offer.annualDifference < 0) {
      return {
        variant: "green" as const,
        text: formatCurrency(offer.annualDifference),
      };
    }
    return {
      variant: "red" as const,
      text: formatCurrency(offer.annualDifference),
    };
  };

  const { variant, text } = getBadgeVariantAndText();

  const getButtonText = () => {
    if (offer.isCurrentDeal) {
      return "Dette er ditt nåværende lån";
    }
    if (hasActiveSwitchToOtherLoan) {
      return "Bytt til dette lånet i stedet";
    }
    return "Bytt til dette lånet";
  };

  const isButtonDisabled = offer.isCurrentDeal;

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
        <Badge variant={variant}>{text}</Badge>
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

        {isCurrentlyBeingSwitched ? (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={handleCancelSwitch}>
              Avbryt bytte
            </Button>
            <Button disabled>
              <Loader2Icon className="animate-spin" />
              Bytter boliglån
            </Button>
          </div>
        ) : !isButtonDisabled ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">{getButtonText()}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {hasActiveSwitchToOtherLoan
                    ? "Bytt til et annet lån?"
                    : "Bekreft lånebytte"}
                </DialogTitle>
                <DialogDescription>
                  {hasActiveSwitchToOtherLoan
                    ? `Du har allerede startet en bytte til ${activeLoanSwitch.targetLoanName}. Vil du bytte til dette lånet i stedet?`
                    : "Vi vil kontakte banken og bytte automatisk for deg. Du trenger ikke gjøre noe, og kan når som helst avbryte prosessen."}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex sm:justify-between">
                <DialogClose asChild>
                  <Button variant="outline">Avbryt</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleStartSwitch}>
                    {hasActiveSwitchToOtherLoan
                      ? "Ja, bytt til dette lånet i stedet"
                      : "Ja, jeg vil bytte til dette lånet"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button className="w-full" disabled>
            {getButtonText()}
          </Button>
        )}
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

  const activeLoanSwitch = useQuery(
    api.loanSwitch.getActiveLoanSwitch,
    userId ? {} : "skip",
  );

  if (
    !authIsLoaded ||
    comparisons === undefined ||
    activeLoanSwitch === undefined
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
        <LoanComparisonItem
          key={offer.id}
          offer={offer}
          index={index}
          activeLoanSwitch={activeLoanSwitch}
        />
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
