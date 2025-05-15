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

export const unionOnboardingSchema = z.object({
  union: z.enum(["nito", "tekna", "obos", "lo", "akademikerne"]).optional(),
});

export type UnionOnboardingFormSchema = z.infer<typeof unionOnboardingSchema>;

export function UnionOnboarding({
  onSubmit,
}: {
  onSubmit: (data: UnionOnboardingFormSchema) => void;
}) {
  const form = useForm<UnionOnboardingFormSchema>({
    resolver: zodResolver(unionOnboardingSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-center justify-center text-center max-w-2xl mx-auto"
      >
        <h3 className="font-semibold text-2xl">Steg 4 av 4</h3>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <Button type="submit">Fullfør</Button> {/* Changed button text */}
      </form>
    </Form>
  );
}
