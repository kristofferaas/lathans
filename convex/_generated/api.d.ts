/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as bank from "../bank.js";
import type * as comparison from "../comparison.js";
import type * as extractLoanInfoFromScreenshot from "../extractLoanInfoFromScreenshot.js";
import type * as files from "../files.js";
import type * as init_data from "../init/data.js";
import type * as init_init from "../init/init.js";
import type * as loanSwitch from "../loanSwitch.js";
import type * as loans from "../loans.js";
import type * as onboarding from "../onboarding.js";
import type * as principalMortgageOffers from "../principalMortgageOffers.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  bank: typeof bank;
  comparison: typeof comparison;
  extractLoanInfoFromScreenshot: typeof extractLoanInfoFromScreenshot;
  files: typeof files;
  "init/data": typeof init_data;
  "init/init": typeof init_init;
  loanSwitch: typeof loanSwitch;
  loans: typeof loans;
  onboarding: typeof onboarding;
  principalMortgageOffers: typeof principalMortgageOffers;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
