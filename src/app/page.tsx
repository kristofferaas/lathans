import LoanDetailsForm from "@/components/loan-details-form";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Lathans</h1>
        <LoanDetailsForm />
      </div>
    </main>
  );
}
