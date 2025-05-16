import { Onboarding } from "@/components/onboarding/onboarding";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto mt-16 mb-48">
        <Suspense fallback={null}>
          <Onboarding />
        </Suspense>
      </div>
    </main>
  );
}
