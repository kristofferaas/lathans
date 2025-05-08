import Link from "next/link";
import { cn } from "@/lib/utils";

export const LathansLogo: typeof Link = ((props) => {
  return (
    <Link
      {...props}
      className={cn("font-extrabold text-2xl italic", props.className)}
    >
      Lathans.
    </Link>
  );
}) as typeof Link;
