import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const loanDetails = sqliteTable("loan_details", {
  id: text("id")
    .primaryKey()
    .default(sql`(uuid4())`),
  loanName: text("loan_name").notNull(),
  loanAmount: text("loan_amount").notNull(),
  nominalRate: text("nominal_rate").notNull(),
  effectiveRate: text("effective_rate").notNull(),
  monthlyPayment: text("monthly_payment").notNull(),
  installment: text("installment").notNull(),
  interest: text("interest").notNull(),
  fees: text("fees").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userLoanDetails = sqliteTable("user_loan_details", {
  id: text("id")
    .primaryKey()
    .default(sql`(uuid4())`),
  clerkUserId: text("clerk_user_id").notNull(),
});
