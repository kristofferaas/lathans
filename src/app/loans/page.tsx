import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { loanDetails } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

async function LoansList() {
  const loans = await db
    .select()
    .from(loanDetails)
    .orderBy(desc(loanDetails.createdAt));

  if (loans.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No loans found. Add your first loan to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {loans.map((loan) => (
        <Card key={loan.id} className="overflow-hidden pt-0">
          <CardHeader className="bg-primary text-white py-4 px-6 gap-0">
            <CardTitle className="text-lg font-medium">
              {loan.loanName}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              <div className="p-4">
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="text-lg font-semibold">{loan.loanAmount} NOK</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nominal Rate</p>
                    <p className="font-medium">{loan.nominalRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Effective Rate</p>
                    <p className="font-medium">{loan.effectiveRate}%</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Payment</p>
                    <p className="font-medium">{loan.monthlyPayment} NOK</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Installment</p>
                    <p className="font-medium">{loan.installment} NOK</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function LoansPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold ml-4">All Loans</h1>
        </div>
        <LoansList />
      </div>
    </main>
  );
}
