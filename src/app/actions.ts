"use server";

import { db } from "@/db";
import { addresses } from "@/db/schema";
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
