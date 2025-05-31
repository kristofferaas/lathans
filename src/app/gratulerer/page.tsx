import { PageContent } from "@/components/app-layout/page-content";
import { NomadIllustration } from "@/components/illustrations/nomad";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default async function UserProfilePage() {
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
          <Button variant="outline">Avbryt bytte</Button>
          <Button disabled>
            <Loader2Icon className="animate-spin" />
            Bytter boliglån
          </Button>
        </div>
      </section>
    </PageContent>
  );
}
