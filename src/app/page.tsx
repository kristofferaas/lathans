import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto flex max-w-3xl justify-center">
        <TryForFree />
      </div>
    </main>
  );
}

function TryForFree() {
  return (
    <Button asChild>
      <Link href="/onboarding">Prøv gratis</Link>
    </Button>
  );
}
