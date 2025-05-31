import { PageContent } from "@/components/app-layout/page-content";
import { Onboarding } from "./components/onboarding";
import { Suspense } from "react";

export default function Home() {
  return (
    <PageContent>
      <Suspense>
        <Onboarding />
      </Suspense>
    </PageContent>
  );
}
