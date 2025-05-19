import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileUp, Upload } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MoneyInput } from "@/components/form/MoneyInput";

export const loanDetailsSchema = z.object({
  loanName: z.string().min(1, "Lånenavn er påkrevd"),
  loanAmount: z.coerce.number({ message: "Lånebeløp er påkrevd" }),
  nominalRate: z.coerce.number({ message: "Nominell rente er påkrevd" }),
  termYears: z.coerce.number({ message: "Løpetid er påkrevd" }),
});

export type LoanDetailsFormSchema = z.infer<typeof loanDetailsSchema>;

export function UserLoanDetails({
  onSubmit,
}: {
  onSubmit: (data: LoanDetailsFormSchema) => void;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 text-center">
      <h3 className="text-2xl font-semibold">Steg 3 av 4</h3>
      <h1 className="text-6xl font-bold italic">Info om ditt boliglån</h1>
      <LoanDetailsForm onSubmit={onSubmit} />
    </div>
  );
}

export default function LoanDetailsForm({
  onSubmit,
}: {
  onSubmit: (data: LoanDetailsFormSchema) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<LoanDetailsFormSchema>({
    resolver: zodResolver(loanDetailsSchema),
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // In a real implementation, we would process the file here
    // and extract the data to fill the form
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <Card className="w-full overflow-hidden pt-0">
      <CardHeader className="bg-primary py-4 text-white">
        <CardTitle className="text-2xl">Låndetaljer</CardTitle>
        <CardDescription className="text-white">
          Skriv inn låneinformasjonen din eller last opp et skjermbilde
        </CardDescription>
      </CardHeader>

      <div
        className={`mx-4 mt-6 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <FileUp className="text-primary h-10 w-10" />
          <p className="text-lg font-medium">Slipp skjermbildet ditt her</p>
          <p className="text-sm text-gray-500">
            eller klikk for å bla gjennom filer
          </p>
          <input
            type="file"
            className="hidden"
            id="screenshot-upload"
            accept="image/*"
          />
          <Button
            variant="outline"
            className="mt-2"
            onClick={() =>
              document.getElementById("screenshot-upload")?.click()
            }
          >
            <Upload className="mr-2 h-4 w-4" /> Last opp skjermbilde
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
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
                        onChange={(value) =>
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
                        <Input
                          {...field}
                          placeholder="Skriv inn nominell rente"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                {/* <FormField
                  control={form.control}
                  name="effectiveRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effektiv rente (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Skriv inn effektiv rente"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              {/* <FormField
                control={form.control}
                name="monthlyPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Månedlig betaling (NOK)</FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="Skriv inn månedlig betaling"
                        {...field}
                        onChange={(value) =>
                          field.onChange(value === undefined ? null : value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* <div className="space-y-3 border-l-2 border-gray-200 pl-4">
                <FormField
                  control={form.control}
                  name="installment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avdrag (NOK)</FormLabel>
                      <FormControl>
                        <MoneyInput
                          placeholder="Skriv inn avdragsbeløp"
                          {...field}
                          onChange={(value) =>
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
                  name="interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rente (NOK)</FormLabel>
                      <FormControl>
                        <MoneyInput
                          placeholder="Skriv inn rentebeløp"
                          {...field}
                          onChange={(value) =>
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
                  name="fees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gebyrer (NOK)</FormLabel>
                      <FormControl>
                        <MoneyInput
                          placeholder="Skriv inn gebyrer"
                          {...field}
                          onChange={(value) =>
                            field.onChange(value === undefined ? null : value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}
            </div>
          </CardContent>

          <CardFooter className="mt-6 flex justify-between border-t py-6">
            <Button type="button" variant="outline" onClick={handleReset}>
              Nullstill
            </Button>
            <Button type="submit">Gå videre</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
