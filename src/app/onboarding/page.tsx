import { Onboarding } from "@/components/onboarding/onboarding";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto mt-16 mb-48 max-w-3xl">
        <Suspense>
          <Onboarding />
        </Suspense>
      </div>
    </main>
  );
}
