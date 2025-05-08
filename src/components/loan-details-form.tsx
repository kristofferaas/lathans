"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileUp } from "lucide-react";
import { createLoanDetails } from "@/app/actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Lagrer..." : "Lagre detaljer"}
    </Button>
  );
}

export default function LoanDetailsForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [loanDetails, setLoanDetails] = useState({
    loanName: "",
    loanAmount: "",
    nominalRate: "",
    effectiveRate: "",
    monthlyPayment: "",
    installment: "",
    interest: "",
    fees: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoanDetails((prev) => ({ ...prev, [name]: value }));
  };

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
    setLoanDetails({
      loanName: "",
      loanAmount: "",
      nominalRate: "",
      effectiveRate: "",
      monthlyPayment: "",
      installment: "",
      interest: "",
      fees: "",
    });
  };

  return (
    <Card className="w-full pt-0 overflow-hidden">
      <CardHeader className="bg-primary text-white py-4">
        <CardTitle className="text-2xl">Låndetaljer</CardTitle>
        <CardDescription className="text-white">
          Skriv inn låneinformasjonen din eller last opp et skjermbilde
        </CardDescription>
      </CardHeader>

      <div
        className={`mx-4 mt-6 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <FileUp className="h-10 w-10 text-primary" />
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

      <form action={createLoanDetails}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="loanName">Lånenavn</Label>
              <Input
                id="loanName"
                name="loanName"
                value={loanDetails.loanName}
                onChange={handleChange}
                required
                placeholder="Skriv inn lånenavn"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="loanAmount">Lånebeløp (NOK)</Label>
              <Input
                id="loanAmount"
                name="loanAmount"
                value={loanDetails.loanAmount}
                onChange={handleChange}
                required
                placeholder="Skriv inn lånebeløp"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nominalRate">Nominell rente (%)</Label>
                <Input
                  id="nominalRate"
                  name="nominalRate"
                  value={loanDetails.nominalRate}
                  onChange={handleChange}
                  required
                  placeholder="Skriv inn nominell rente"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="effectiveRate">Effektiv rente (%)</Label>
                <Input
                  id="effectiveRate"
                  name="effectiveRate"
                  value={loanDetails.effectiveRate}
                  onChange={handleChange}
                  required
                  placeholder="Skriv inn effektiv rente"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="monthlyPayment">Månedlig betaling (NOK)</Label>
              <Input
                id="monthlyPayment"
                name="monthlyPayment"
                value={loanDetails.monthlyPayment}
                onChange={handleChange}
                required
                placeholder="Skriv inn månedlig betaling"
              />
            </div>

            <div className="pl-4 border-l-2 border-gray-200 space-y-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="installment">Avdrag (NOK)</Label>
                <Input
                  id="installment"
                  name="installment"
                  value={loanDetails.installment}
                  onChange={handleChange}
                  required
                  placeholder="Skriv inn avdragsbeløp"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="interest">Rente (NOK)</Label>
                <Input
                  id="interest"
                  name="interest"
                  value={loanDetails.interest}
                  onChange={handleChange}
                  required
                  placeholder="Skriv inn rentebeløp"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fees">Gebyrer (NOK)</Label>
                <Input
                  id="fees"
                  name="fees"
                  value={loanDetails.fees}
                  onChange={handleChange}
                  required
                  placeholder="Skriv inn gebyrer"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t py-6 mt-6">
          <Button type="button" variant="outline" onClick={handleReset}>
            Nullstill
          </Button>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
