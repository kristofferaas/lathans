import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap md:text-sm",
  {
    variants: {
      variant: {
        gray: "bg-gray-200 text-gray-700",
        green: "bg-green-100 text-green-700",
        red: "bg-red-100 text-red-700",
        orange: "bg-orange-100 text-orange-700",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  },
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, variant, className }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)}>{children}</div>
  );
}
