"use server";

import { db } from "@/db";
import { loanDetails } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createLoanDetails(formData: FormData) {
  const data = {
    loanName: formData.get("loanName") as string,
    loanAmount: formData.get("loanAmount") as string,
    nominalRate: formData.get("nominalRate") as string,
    effectiveRate: formData.get("effectiveRate") as string,
    monthlyPayment: formData.get("monthlyPayment") as string,
    installment: formData.get("installment") as string,
    interest: formData.get("interest") as string,
    fees: formData.get("fees") as string,
  };

  // Validate all fields are present
  if (Object.values(data).some((value) => !value)) {
    throw new Error("All fields are required");
  }

  await db.insert(loanDetails).values(data);
  revalidatePath("/");
}
