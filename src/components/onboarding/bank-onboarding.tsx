"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

export const bankOnboardingSchema = z.object({
  bank: z.enum(["nordea", "dnb", "storebrand", "sparebank1", "danske-bank"], {
    message: "Du må velge en bank",
  }),
});

export type BankOnboardingFormSchema = z.infer<typeof bankOnboardingSchema>;

export function BankOnboarding({
  onSubmit,
}: {
  onSubmit: (data: BankOnboardingFormSchema) => void;
}) {
  const form = useForm<BankOnboardingFormSchema>({
    resolver: zodResolver(bankOnboardingSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-center justify-center text-center max-w-2xl mx-auto"
      >
        <h3 className="font-semibold text-2xl">Steg 2 av 5</h3>
        <h1 className="text-6xl font-bold italic">Kom i gang</h1>
        <p className="text-xl font-normal">Hvilken bank har du boliglån i?</p>
        <FormField
          control={form.control}
          name="bank"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <Button type="submit">Gå videre</Button>
      </form>
    </Form>
  );
}
