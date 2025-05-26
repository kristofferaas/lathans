import { query } from "./_generated/server";
import { v, Infer } from "convex/values";

const comparisonLoans = v.array(
  v.object({
    id: v.string(),
    isCurrentDeal: v.boolean(),
    name: v.string(),
    nominalRate: v.number(),
    termYears: v.number(),
    amount: v.number(),
    annualDifference: v.number(),
    actualYearlyPayment: v.number(),
    effectiveRate: v.number(),
    bankName: v.string(),
  }),
);

export type ComparisonLoans = Infer<typeof comparisonLoans>;

/**
 * Calculates the yearly payment for a fixed-rate mortgage.
 * This is a server-side implementation of the mortgage calculation.
 */
function calculateYearlyFixedRateMortgagePayment(
  principal: number,
  monthlyRate: number,
  loanTermYears: number,
): number {
  if (isNaN(principal) || principal < 0) {
    throw new Error("Principal must be a non-negative number.");
  }
  if (isNaN(monthlyRate) || monthlyRate < 0) {
    throw new Error("Monthly rate must be a non-negative number.");
  }
  if (isNaN(loanTermYears) || loanTermYears < 0) {
    throw new Error("Loan term in years must be a non-negative number.");
  }

  if (principal === 0) {
    return 0.0;
  }

  if (loanTermYears === 0) {
    return principal;
  }

  if (monthlyRate === 0) {
    return principal / loanTermYears;
  }

  const numberOfPayments = loanTermYears * 12;
  const termFactor = Math.pow(1 + monthlyRate, numberOfPayments);

  if (termFactor === Infinity) {
    throw new Error(
      "Calculation resulted in overflow (termFactor is Infinity). " +
        "Inputs (rate/term) are likely too extreme or the loan term is excessively long.",
    );
  }

  const denominator = termFactor - 1;

  if (denominator === 0) {
    throw new Error(
      "Numerical instability: (1+r)^n - 1 is zero, leading to division by zero. " +
        "This might occur with extremely small (but non-zero) interest rates or specific term lengths causing precision issues.",
    );
  }

  const monthlyPayment = (principal * (monthlyRate * termFactor)) / denominator;

  if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) {
    throw new Error(
      "Failed to calculate a valid monthly payment. " +
        "Result was NaN or Infinity. Review inputs for extreme values or potential for undefined mathematical operations.",
    );
  }

  const yearlyPayment = monthlyPayment * 12;
  return yearlyPayment;
}

/**
 * Get loan comparison data with calculated annual differences.
 * This query combines user loan data with mortgage offers and calculates
 * the annual payment differences server-side.
 */
export const getLoanComparison = query({
  args: {},
  returns: comparisonLoans,
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("No user found");
    }

    // Get user loan data
    const userLoan = await ctx.db
      .query("userLoan")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (!userLoan) {
      throw new Error("No user loan found");
    }

    // Validate required fields
    if (
      userLoan.loanName === null ||
      userLoan.loanName === undefined ||
      userLoan.loanAmount === null ||
      userLoan.loanAmount === undefined ||
      userLoan.nominalRate === null ||
      userLoan.nominalRate === undefined ||
      userLoan.termYears === null ||
      userLoan.termYears === undefined ||
      userLoan.bank === null ||
      userLoan.bank === undefined
    ) {
      throw new Error("User loan data is missing essential fields");
    }

    // Type assertion after validation
    const validatedUserLoan = {
      ...userLoan,
      loanName: userLoan.loanName as string,
      loanAmount: userLoan.loanAmount as number,
      nominalRate: userLoan.nominalRate as number,
      effectiveRate: userLoan.effectiveRate as number | undefined,
      termYears: userLoan.termYears as number,
      bank: userLoan.bank as string,
    };

    // Get mortgage offers
    const offers = await ctx.db.query("principalMortgageOffers").collect();

    // Calculate user's current yearly payment using effective rate
    // Convert percentage rate to decimal rate for calculation (5.24% -> 0.0524)
    const userEffectiveRate =
      validatedUserLoan.effectiveRate ?? validatedUserLoan.nominalRate;
    const userActualYearlyPayment = calculateYearlyFixedRateMortgagePayment(
      validatedUserLoan.loanAmount,
      userEffectiveRate / 100 / 12,
      validatedUserLoan.termYears,
    );

    // Create comparison loans array with consistent structure
    const comparisonLoans: ComparisonLoans = [];

    // Add user's current loan
    comparisonLoans.push({
      id: validatedUserLoan._id as string,
      isCurrentDeal: true,
      name: validatedUserLoan.loanName,
      nominalRate: validatedUserLoan.nominalRate,
      termYears: validatedUserLoan.termYears,
      amount: validatedUserLoan.loanAmount,
      annualDifference: 0,
      actualYearlyPayment: userActualYearlyPayment,
      // Use the same effective rate that was used for calculation
      effectiveRate: userEffectiveRate,
      bankName: validatedUserLoan.bank,
    });

    // Add mortgage offers with bank information
    for (const offer of offers) {
      // Convert percentage rate to decimal rate for calculation (5.24% -> 0.0524)
      // Use effective rate for more accurate payment calculations
      const offerActualYearlyPayment = calculateYearlyFixedRateMortgagePayment(
        validatedUserLoan.loanAmount,
        offer.effectiveRate / 100 / 12,
        validatedUserLoan.termYears,
      );

      // Get bank information
      const bank = await ctx.db.get(offer.bankId);

      if (!bank) {
        throw new Error("Bank not found");
      }

      comparisonLoans.push({
        id: offer._id,
        isCurrentDeal: false,
        name: offer.name,
        nominalRate: offer.nominalRate,
        termYears: validatedUserLoan.termYears,
        amount: validatedUserLoan.loanAmount,
        annualDifference: offerActualYearlyPayment - userActualYearlyPayment,
        actualYearlyPayment: offerActualYearlyPayment,
        effectiveRate: offer.effectiveRate,
        bankName: bank.name,
      });
    }

    // Sort by annual difference (best deals first)
    comparisonLoans.sort((a, b) => a.annualDifference - b.annualDifference);

    return comparisonLoans;
  },
});
