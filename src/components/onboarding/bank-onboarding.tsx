"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bankValues = [
  "nordea",
  "dnb",
  "storebrand",
  "sparebank1",
  "danske-bank",
] as const;

export const bankOnboardingFormSchema = z.object({
  bank: z.enum(bankValues, {
    required_error: "You need to select a bank.",
  }),
});

export type BankOnboardingFormSchema = z.infer<typeof bankOnboardingFormSchema>;

interface BankOnboardingProps {
  onSubmit: (data: BankOnboardingFormSchema) => void;
  initialData?: Partial<BankOnboardingFormSchema>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function BankOnboarding({
  onSubmit,
  initialData,
  isLoading,
  errorMessage,
}: BankOnboardingProps) {
  const form = useForm<BankOnboardingFormSchema>({
    resolver: zodResolver(bankOnboardingFormSchema),
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 text-center"
      >
        <h3 className="text-2xl font-semibold">Steg 1 av 4</h3>
        <h1 className="text-6xl font-bold italic">Kom i gang</h1>
        <p className="text-xl font-normal">Hvilken bank har du boliglån i?</p>
        <FormField
          control={form.control}
          name="bank"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ""}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Velg" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="nordea">Nordea</SelectItem>
                  <SelectItem value="dnb">DNB</SelectItem>
                  <SelectItem value="storebrand">Storebrand</SelectItem>
                  <SelectItem value="sparebank1">Sparebank 1</SelectItem>
                  <SelectItem value="danske-bank">Danske Bank</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && (
          <p className="text-destructive text-sm font-medium">{errorMessage}</p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
