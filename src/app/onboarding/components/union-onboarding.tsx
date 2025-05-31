"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

export const unionOnboardingSchema = z.object({
  union: z.enum(["nito", "tekna", "obos", "lo", "akademikerne"]).optional(),
});

export type UnionOnboardingFormSchema = z.infer<typeof unionOnboardingSchema>;

interface UnionOnboardingProps {
  onSubmit: (data: UnionOnboardingFormSchema) => void;
  initialData?: Partial<UnionOnboardingFormSchema>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function UnionOnboarding({
  onSubmit,
  initialData,
  isLoading,
  errorMessage,
}: UnionOnboardingProps) {
  const form = useForm<UnionOnboardingFormSchema>({
    resolver: zodResolver(unionOnboardingSchema),
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({ union: undefined });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 text-center"
      >
        <h3 className="text-2xl font-semibold">Steg 4 av 4</h3>
        <h1 className="text-6xl font-bold italic">Medlemskap</h1>
        <p className="text-xl font-normal">
          Har du noen medlemskap vi burde vite om for å kunne gi deg de beste
          tilbudene?
        </p>
        <FormField
          control={form.control}
          name="union"
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
                  <SelectItem value="nito">NITO</SelectItem>
                  <SelectItem value="tekna">Tekna</SelectItem>
                  <SelectItem value="obos">OBOS</SelectItem>
                  <SelectItem value="lo">LO</SelectItem>
                  <SelectItem value="akademikerne">Akademikerne</SelectItem>
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
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
