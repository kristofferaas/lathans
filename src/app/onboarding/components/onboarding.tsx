"use client";

import { BankOnboarding, BankOnboardingFormSchema } from "./bank-onboarding";
import { parseAsInteger, useQueryState } from "nuqs";
import { UnionOnboarding, UnionOnboardingFormSchema } from "./union-onboarding";
import { LoanDetailsFormSchema, UserLoanDetails } from "./user-loan-details";
import { UploadScreenshotOnboarding } from "./upload-screenshot-onboarding";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Id } from "@convex/_generated/dataModel";

export function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userLoanData = useQuery(api.onboarding.getUserLoan);

  const saveBankMutation = useMutation(api.onboarding.saveBank);
  const saveScreenshotMutation = useMutation(api.onboarding.saveScreenshot);
  const saveLoanDetailsMutation = useMutation(api.onboarding.saveLoanDetails);
  const saveUnionMutation = useMutation(api.onboarding.saveUnion);

  const [userLoanId, setUserLoanId] = useState<Id<"userLoan"> | null>(null);

  useEffect(() => {
    if (userLoanData) {
      setUserLoanId(userLoanData._id);
    }
  }, [userLoanData]);

  const handleBankSubmit = async (data: BankOnboardingFormSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      const id = await saveBankMutation({ bank: data.bank });
      setUserLoanId(id);
      setStep(2, { scroll: true, history: "push" });
    } catch (e) {
      console.error("Failed to save bank details:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScreenshotUploadSubmit = async (storageId: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!userLoanId && storageId) {
        throw new Error(
          "Cannot save screenshot without existing loan details record.",
        );
      }
      if (storageId) {
        await saveScreenshotMutation({
          screenshotStorageId: storageId as Id<"_storage"> | undefined,
        });
      }
      setStep(3, { scroll: true, history: "push" });
    } catch (e) {
      console.error("Failed to save screenshot details:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoanDetailsSubmit = async (data: LoanDetailsFormSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!userLoanId) {
        throw new Error(
          "Cannot save loan details without existing loan details record.",
        );
      }
      await saveLoanDetailsMutation({
        loanName: data.loanName,
        loanAmount: data.loanAmount,
        nominalRate: data.nominalRate,
        effectiveRate: data.effectiveRate,
        termYears: data.termYears,
      });
      setStep(4, { scroll: true, history: "push" });
    } catch (e) {
      console.error("Failed to save loan details:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnionSubmit = async ({ union }: UnionOnboardingFormSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!userLoanId) {
        throw new Error(
          "Cannot save union without existing loan details record.",
        );
      }
      if (!union) {
        setError("Union selection is required.");
        setIsLoading(false);
        return;
      }
      await saveUnionMutation({ union });
      router.push("/boliglan");
    } catch (e) {
      console.error("Failed to save union details:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <BankOnboarding
        onSubmit={handleBankSubmit}
        initialData={{
          bank:
            (userLoanData?.bank as
              | BankOnboardingFormSchema["bank"]
              | undefined) ?? undefined,
        }}
        isLoading={isLoading}
        errorMessage={error}
      />
    );
  }

  if (step === 2) {
    return (
      <UploadScreenshotOnboarding
        onSubmit={handleScreenshotUploadSubmit}
        isLoading={isLoading}
        errorMessage={error}
        existingScreenshotStorageId={userLoanData?.screenshotStorageId ?? null}
      />
    );
  }

  if (step === 3) {
    return (
      <UserLoanDetails
        onSubmit={handleLoanDetailsSubmit}
        initialData={
          userLoanData
            ? {
                loanName: userLoanData.loanName ?? "",
                loanAmount: userLoanData.loanAmount ?? undefined,
                nominalRate: userLoanData.nominalRate ?? undefined,
                effectiveRate: userLoanData.effectiveRate ?? undefined,
                termYears: userLoanData.termYears ?? undefined,
              }
            : undefined
        }
        isLoading={isLoading}
        errorMessage={error}
      />
    );
  }

  if (step === 4) {
    return (
      <UnionOnboarding
        onSubmit={handleUnionSubmit}
        isLoading={isLoading}
        errorMessage={error}
        initialData={{
          union:
            (userLoanData?.union as
              | UnionOnboardingFormSchema["union"]
              | undefined) ?? undefined,
        }}
      />
    );
  }

  if (userLoanData === undefined) {
    return <div>Loading onboarding status...</div>;
  }

  return <div>Loading or invalid step...</div>;
}
