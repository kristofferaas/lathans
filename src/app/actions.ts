"use server";

import { db } from "@/db";
import { addresses, loanDetails } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createAddress(formData: FormData) {
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;

  if (!street || !city || !state || !zipCode) {
    throw new Error("All fields are required");
  }

  await db.insert(addresses).values({
    street,
    city,
    state,
    zipCode,
  });

  revalidatePath("/");
}

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
