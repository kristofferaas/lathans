/**
 * Calculates the yearly payment for a fixed-rate mortgage.
 *
 * @param principal The total loan amount (e.g., 240000).
 * @param monthlyNominalRate The monthly nominal interest rate as a decimal (e.g., 0.004167 for 5%).
 * @param loanTermYears The loan term in years (e.g., 30).
 * @returns The total yearly mortgage payment.
 * @throws Error if inputs are invalid (negative, NaN) or if calculation results in overflow/instability.
 */
export function calculateYearlyFixedRateMortgagePayment(
  principal: number,
  monthlyNominalRate: number,
  loanTermYears: number,
): number {
  if (isNaN(principal) || principal < 0) {
    throw new Error("Principal must be a non-negative number.");
  }
  if (isNaN(monthlyNominalRate) || monthlyNominalRate < 0) {
    throw new Error("Monthly nominal rate must be a non-negative number.");
  }
  if (isNaN(loanTermYears) || loanTermYears < 0) {
    throw new Error("Loan term in years must be a non-negative number.");
  }

  if (principal === 0) {
    return 0.0;
  }

  if (loanTermYears === 0) {
    // If the loan term is 0, the entire principal is due immediately.
    return principal;
  }

  if (monthlyNominalRate === 0) {
    // No interest, so principal is paid evenly over the term.
    // yearly payment = (principal / (loanTermYears * 12)) * 12
    // loanTermYears cannot be 0 here due to the prior check.
    return principal / loanTermYears;
  }

  const numberOfPayments = loanTermYears * 12;

  // M = P * [r(1+r)^n] / [(1+r)^n - 1]
  // where r is monthlyNominalRate and n is numberOfPayments.

  const termFactor = Math.pow(1 + monthlyNominalRate, numberOfPayments);

  if (termFactor === Infinity) {
    // This can happen if (1 + monthlyNominalRate) is > 1 and numberOfPayments is very large.
    throw new Error(
      "Calculation resulted in overflow (termFactor is Infinity). " +
        "Inputs (rate/term) are likely too extreme or the loan term is excessively long.",
    );
  }

  const denominator = termFactor - 1;

  if (denominator === 0) {
    // This can happen if:
    // 1. monthlyNominalRate is 0 (already handled by monthlyNominalRate === 0 check).
    // 2. monthlyNominalRate is extremely small (but non-zero) and numberOfPayments is such that
    //    (1 + monthlyNominalRate)^numberOfPayments numerically equals 1 due to precision limits.
    // This would lead to division by zero.
    throw new Error(
      "Numerical instability: (1+r)^n - 1 is zero, leading to division by zero. " +
        "This might occur with extremely small (but non-zero) interest rates or specific term lengths causing precision issues.",
    );
  }

  const monthlyPayment =
    (principal * (monthlyNominalRate * termFactor)) / denominator;

  // Check if the calculated monthlyPayment is a valid finite number.
  if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) {
    throw new Error(
      "Failed to calculate a valid monthly payment. " +
        "Result was NaN or Infinity. Review inputs for extreme values or potential for undefined mathematical operations.",
    );
  }

  const yearlyPayment = monthlyPayment * 12;
  return yearlyPayment;
}
