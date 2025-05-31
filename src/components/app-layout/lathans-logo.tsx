import Link from "next/link";
import { cn } from "@/lib/utils";

export const LathansLogo: typeof Link = ((props) => {
  return (
    <Link
      {...props}
      className={cn(
        "text-xl font-extrabold italic md:text-2xl",
        props.className,
      )}
    >
      Lathans.
    </Link>
  );
}) as typeof Link;
