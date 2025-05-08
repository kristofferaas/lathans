import LoanDetailsForm from "@/components/loan-details-form";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <LoanDetailsForm />
        <div className="mt-4 text-center">
          <Link
            href="/loans"
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            Se alle lån
          </Link>
        </div>
      </div>
    </main>
  );
}
