import { PageContent } from "@/components/app-layout/page-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <PageContent className="flex flex-col items-center justify-center">
      <TryForFree />
    </PageContent>
  );
}

function TryForFree() {
  return (
    <Button asChild>
      <Link href="/onboarding">Prøv gratis</Link>
    </Button>
  );
}
