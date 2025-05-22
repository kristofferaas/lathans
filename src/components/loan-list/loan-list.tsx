"use client";

import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";

function Loans({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="loans"
      className="w-full space-y-2.5"
      {...props}
    />
  );
}

function LoanItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="loan-item"
      className={cn(
        "bg-card text-card-foreground overflow-hidden rounded-md border",
        className,
      )}
      {...props}
    />
  );
}

function LoanTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="loan-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 hover:bg-secondary flex w-full flex-1 items-center justify-between gap-4 p-5 text-left text-sm font-medium transition-all outline-none hover:no-underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function LoanContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="loan-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
      {...props}
    >
      <div className={cn("border-border border-t p-4 text-sm", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { LoanContent, LoanItem, Loans, LoanTrigger };
