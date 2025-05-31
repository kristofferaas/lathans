import { NomadIllustration } from "@/components/illustrations/nomad";
import { Badge } from "@/components/loan-list/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center">
      <Badge variant="orange">Automatisk bytte av boliglån</Badge>
      <h1 className="text-foreground text-4xl font-bold tracking-tight italic sm:text-6xl lg:text-7xl">
        Er du også en lathans som aldri sjekker renta?
      </h1>
      <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-8 sm:text-xl">
        Vi overvåker alle banker til en hver tid og putter deg automatisk over
        på det boliglånet med laveste renter.
      </p>
      <div className="flex items-center justify-center">
        <Button asChild>
          <Link href="/onboarding">Prøv gratis</Link>
        </Button>
      </div>
      <NomadIllustration className="mx-auto aspect-square max-w-lg" />
    </section>
  );
}
