import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const addresses = sqliteTable("addresses", {
  id: text("id")
    .primaryKey()
    .default(sql`(uuid4())`),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

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
