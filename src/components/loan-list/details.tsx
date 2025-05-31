export function Details({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 md:grid-cols-3">{children}</div>;
}

interface DetailItemProps {
  label: string;
  value: string;
}

export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="px-1 py-3 text-center">
      <p className="text-card-foreground text-sm font-semibold md:text-base">
        {value}
      </p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}
