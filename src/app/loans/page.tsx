import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ComparisonList } from "./components/comparison-list";

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
        <ComparisonList />
      </div>
    </main>
  );
}
