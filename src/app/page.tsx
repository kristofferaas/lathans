import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto flex justify-center">
        <Button asChild>
          <Link href="/onboarding">Prøv gratis</Link>
        </Button>
      </div>
    </main>
  );
}
