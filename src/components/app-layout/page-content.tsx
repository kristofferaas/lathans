import { cn } from "@/lib/utils";

export function PageContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow items-center p-4 md:p-8">
      <main className={cn("mx-auto w-full max-w-3xl", className)}>
        {children}
      </main>
    </div>
  );
}
