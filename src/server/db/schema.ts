import { sql } from "drizzle-orm";
import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

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
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  nominalRate: real("nominal_rate").notNull(),
  termYears: real("term_years").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const principalMortgageOffers = sqliteTable(
  "principal_mortgage_offers",
  {
    id: text("id")
      .primaryKey()
      .default(sql`(uuid4())`),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),

    // Principal mortgage offers
    name: text("name").notNull(), // Name of the mortgage offer, e.g., "Boligspar fra DNB"
    nominalRate: real("nominal_rate").notNull(), // Nominal rate as a decimal (e.g., 0.05 for 5%)
  },
);
