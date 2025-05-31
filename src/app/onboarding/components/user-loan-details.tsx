import { MoneyInput } from "@/components/form/money-input";
import { PercentInput } from "@/components/form/percent-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const loanDetailsSchema = z.object({
  loanName: z.string().min(1, "Lånenavn er påkrevd"),
  loanAmount: z.coerce.number().min(1, "Loan amount must be greater than 0"),
  nominalRate: z.coerce.number({ message: "Nominell rente er påkrevd" }),
  effectiveRate: z.coerce.number({ message: "Effektiv rente er påkrevd" }),
  termYears: z.coerce.number({ message: "Løpetid er påkrevd" }),
});

export type LoanDetailsFormSchema = z.infer<typeof loanDetailsSchema>;

interface UserLoanDetailsProps {
  onSubmit: (data: LoanDetailsFormSchema) => void;
  initialData?: Partial<LoanDetailsFormSchema>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function UserLoanDetails({
  onSubmit,
  initialData,
  isLoading,
  errorMessage,
}: UserLoanDetailsProps) {
  const form = useForm<LoanDetailsFormSchema>({
    resolver: zodResolver(loanDetailsSchema),
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        loanName: initialData.loanName ?? "",
        loanAmount: initialData.loanAmount ?? undefined,
        nominalRate: initialData.nominalRate ?? undefined,
        effectiveRate: initialData.effectiveRate ?? undefined,
        termYears: initialData.termYears ?? undefined,
      });
    } else {
      form.reset({
        loanName: "",
        loanAmount: undefined,
        nominalRate: undefined,
        effectiveRate: undefined,
        termYears: undefined,
      });
    }
  }, [initialData, form]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 text-center">
      <h3 className="text-2xl font-semibold">Steg 3 av 4</h3>
      <h1 className="text-6xl font-bold italic">Info om ditt boliglån</h1>
      <p className="text-xl font-normal">
        Skriv inn låneinformasjonen din manuelt.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4"
        >
          <FormField
            control={form.control}
            name="loanName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lånenavn</FormLabel>
                <FormControl>
                  <Input placeholder="Skriv inn lånenavn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lånebeløp (NOK)</FormLabel>
                <FormControl>
                  <MoneyInput
                    {...field}
                    placeholder="Skriv inn lånebeløp"
                    onChange={(value: number | undefined) =>
                      field.onChange(value === undefined ? null : value)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="nominalRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nominell rente (%)</FormLabel>
                  <FormControl>
                    <PercentInput
                      {...field}
                      placeholder="Skriv inn nominell rente"
                      onChange={(value: number | undefined) =>
                        field.onChange(value === undefined ? null : value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="effectiveRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effektiv rente (%)</FormLabel>
                  <FormControl>
                    <PercentInput
                      {...field}
                      placeholder="Skriv inn effektiv rente"
                      onChange={(value: number | undefined) =>
                        field.onChange(value === undefined ? null : value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="termYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Løpetid (år)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Skriv inn løpetid"
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {errorMessage && (
        <p className="text-destructive text-sm font-medium">{errorMessage}</p>
      )}
      <Button
        type="button"
        onClick={form.handleSubmit(onSubmit)}
        className="w-52"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Gå videre"}
      </Button>
    </div>
  );
}
