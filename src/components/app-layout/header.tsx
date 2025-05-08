import Link from "next/link";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";

export function Header() {
  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Lathans.
        </Link>
        <div className="hidden md:flex items-center">
          <nav className="flex space-x-6">
            <Link href="#" className="text-sm text-secondary-foreground">
              Om Lathans
            </Link>
            <Link href="#" className="text-sm text-secondary-foreground">
              Ofte stilte spørsmål
            </Link>
            <Link href="#" className="text-sm text-secondary-foreground">
              Bank og sikkerhet
            </Link>
          </nav>
        </div>
        <Button className="hidden md:block">Prøv gratis</Button>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon />
        </Button>
      </div>
    </header>
  );
}
