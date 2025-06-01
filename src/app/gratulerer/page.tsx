"use client";

import { PageContent } from "@/components/app-layout/page-content";
import { NomadIllustration } from "@/components/illustrations/nomad";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function UserProfilePage() {
  const { userId, isLoaded: authIsLoaded } = useAuth();
  const router = useRouter();

  const activeLoanSwitch = useQuery(
    api.loanSwitch.getActiveLoanSwitch,
    userId ? {} : "skip",
  );

  const cancelLoanSwitch = useMutation(api.loanSwitch.cancelLoanSwitch);

  const handleCancelSwitch = async () => {
    try {
      await cancelLoanSwitch({});
      router.push("/boliglan");
    } catch (error) {
      console.error("Failed to cancel loan switch:", error);
    }
  };

  if (!authIsLoaded || activeLoanSwitch === undefined) {
    return (
      <PageContent>
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-64 rounded bg-gray-200"></div>
            <div className="mb-8 h-12 w-48 rounded bg-gray-200"></div>
            <div className="mb-8 size-28 rounded-full bg-gray-200"></div>
            <div className="mb-8 h-6 w-96 rounded bg-gray-200"></div>
            <div className="flex gap-3">
              <div className="h-10 w-32 rounded bg-gray-200"></div>
              <div className="h-10 w-40 rounded bg-gray-200"></div>
            </div>
          </div>
        </section>
      </PageContent>
    );
  }

  if (!userId) {
    return (
      <PageContent>
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center">
          <Alert>
            <AlertTitle>Pålogging kreves</AlertTitle>
            <AlertDescription>
              Vennligst logg inn for å se status på lånebyttet.
            </AlertDescription>
          </Alert>
        </section>
      </PageContent>
    );
  }

  if (!activeLoanSwitch) {
    return (
      <PageContent>
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center">
          <Alert>
            <AlertTitle>Ingen aktiv lånebytte</AlertTitle>
            <AlertDescription>
              Det ser ikke ut til at du har startet en lånebytte. Gå tilbake til
              lånesammenligning for å starte en bytte.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/boliglan")}>
            Gå til lånesammenligning
          </Button>
        </section>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <section className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center">
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-8 font-bold sm:text-xl">
          Dette vil ta 2 - 5 virkedager. Du kan nå slappe av og la oss gjøre
          jobben.
        </p>
        <h1 className="text-foreground text-4xl font-bold tracking-tight italic sm:text-6xl lg:text-7xl">
          Gratulerer!
        </h1>
        <div className="relative size-28 overflow-hidden rounded-full border">
          <NomadIllustration className="absolute top-[-300px] left-[-120px] size-[728px]" />
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-8 sm:text-xl">
          Vi vil kontakte banken og bytte for deg. Du kan når som helst avbryte
          prosessen. Du hører fra oss når alt er klart.
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button variant="outline" onClick={handleCancelSwitch}>
            Avbryt bytte
          </Button>
          <Button disabled>
            <Loader2Icon className="animate-spin" />
            Bytter boliglån
          </Button>
        </div>
      </section>
    </PageContent>
  );
}
