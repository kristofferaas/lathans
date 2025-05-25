"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

// Define the Zod schema for the expected JSON output
const LoanDetailsSchema = z.object({
  loanName: z.string().optional().nullable(),
  remainingLoanAmount: z.number().optional().nullable(),
  nominalInterestRate: z.number().optional().nullable(), // Percentage value, e.g., 5.24 for 5.24%
  effectiveInterestRate: z.number().optional().nullable(), // Percentage value, e.g., 5.24 for 5.24%
});

// Initialize OpenAI client to use OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // Your OpenRouter API key
  baseURL: "https://openrouter.ai/api/v1",
});

export const analyzeImageAndGetLoanDetails = action({
  args: {
    storageId: v.id("_storage"), // The ID of the image file in Convex storage
    // The basePrompt can be enhanced if needed, but the core instruction for JSON is below
    basePrompt: v.optional(v.string()),
  },
  // Update the return type to match the Zod schema
  returns: v.object({
    loanName: v.optional(v.string()),
    remainingLoanAmount: v.optional(v.number()),
    nominalInterestRate: v.optional(v.number()),
    effectiveInterestRate: v.optional(v.number()),
  }),
  handler: async (ctx, args) => {
    const imageBlob = await ctx.storage.get(args.storageId);
    if (!imageBlob) {
      throw new Error(`Image with storageId ${args.storageId} not found.`);
    }

    const imageArrayBuffer = await imageBlob.arrayBuffer();
    const imageBase64 = Buffer.from(imageArrayBuffer).toString("base64");
    const imageMediaType = imageBlob.type;

    const userPrompt =
      args.basePrompt ||
      "Analyze the provided image which contains loan details.";
    const fullPrompt = `${userPrompt} 
    Extract the following details and respond ONLY with a valid JSON object. Do not include any other text, explanations, or code blocks in your response.
    The JSON object should contain the following optional fields:
    1. "loanName": The name or type of the loan (string).
    2. "remainingLoanAmount": The outstanding or remaining principal amount of the loan (numerical value, always positive. If the value is negative, remove the minus sign).
    3. "nominalInterestRate": The nominal annual interest rate for the loan (numerical value as a percentage, e.g., if it's 5.2%, return 5.2).
    4. "effectiveInterestRate": The effective annual interest rate for the loan (numerical value as a percentage, e.g., if it's 5.2%, return 5.2).
    
    All fields are optional. If a specific detail is not found or is unclear, return an empty JSON object: {}. If a field is present but its value is truly not known or applicable, you may set its value to null.
    Example valid responses: 
    {"loanName": "Home Mortgage", "remainingLoanAmount": 150000, "nominalInterestRate": 3.25, "effectiveInterestRate": 3.25}
    {"loanName": "Student Loan", "remainingLoanAmount": 12000, "nominalInterestRate": null, "effectiveInterestRate": null}
    {"nominalInterestRate": 5.5, "effectiveInterestRate": 5.5}
    {}
    Ensure the JSON is well-formed. Return ONLY valid JSON.`;

    try {
      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-lite-001",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: fullPrompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${imageMediaType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 250, // Increased slightly for potentially more complex JSON
        response_format: zodResponseFormat(
          LoanDetailsSchema,
          "loan_details_output",
        ),
      });

      const rawResponse = response.choices[0].message.content;
      if (rawResponse === null || rawResponse.trim() === "") {
        throw new Error(
          "LLM returned an empty or null response despite expecting JSON.",
        );
      }

      let jsonData;
      try {
        jsonData = JSON.parse(rawResponse);
      } catch (jsonParseError) {
        console.error(
          "Failed to parse LLM response as JSON (even with zodResponseFormat in request):",
          rawResponse,
          jsonParseError,
        );
        throw new Error(
          `LLM response was not valid JSON. Response: ${rawResponse}`,
        );
      }

      const validationResult = LoanDetailsSchema.safeParse(jsonData);
      if (!validationResult.success) {
        console.error(
          "Zod validation failed (despite zodResponseFormat in request):",
          validationResult.error.issues,
          "Data:",
          jsonData,
        );
        throw new Error(
          `LLM output failed Zod validation: ${validationResult.error.issues.map((i) => `${i.path.join(".")} (${i.code}): ${i.message}`).join(", ")}`,
        );
      }

      const validatedData = validationResult.data;
      const finalData = {
        loanName: validatedData.loanName ?? undefined,
        remainingLoanAmount: validatedData.remainingLoanAmount ?? undefined,
        nominalInterestRate: validatedData.nominalInterestRate ?? undefined,
        effectiveInterestRate: validatedData.effectiveInterestRate ?? undefined,
      };

      return finalData;
    } catch (e) {
      console.error(
        "Raw error during LLM image analysis and JSON processing:",
        e,
      );
      if (e instanceof OpenAI.APIError) {
        console.error(
          `OpenRouter API Error (Gemini): ${e.status} ${e.name} - ${e.message}`,
        );
        throw new Error(
          `OpenRouter API Error (Gemini): ${e.status} ${e.name} - ${e.message}`,
        );
      } else if (e instanceof Error) {
        console.error(`Processing error: ${e.message}`);
        throw new Error(
          `Failed to analyze image and process JSON: ${e.message}`,
        );
      } else {
        console.error(
          "Unknown error type during image analysis and JSON processing.",
        );
        throw new Error(
          "Failed to analyze image and process JSON due to an unexpected error of unknown type.",
        );
      }
    }
  },
});
