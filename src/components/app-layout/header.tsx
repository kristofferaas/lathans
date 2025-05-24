import Link from "next/link";
import { Menu } from "lucide-react";
import { LathansLogo } from "./lathans-logo";
import { User } from "./user";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationLinks = [
  { href: "#", label: "Om Lathans" },
  { href: "#", label: "Ofte stilte spørsmål" },
  { href: "#", label: "Bank og sikkerhet" },
];

export function Header() {
  return (
    <header className="px-4 py-4 md:px-8 md:py-6">
      <div className="grid h-10 grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Mobile: Hamburger Menu (Left) | Desktop: Logo (Left) */}
        <div className="min-w-26 justify-self-start">
          {/* Mobile Hamburger Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                aria-label="Åpne hovedmeny"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Hovedmeny</SheetTitle>
                <SheetDescription>
                  Naviger til forskjellige deler av Lathans
                </SheetDescription>
              </SheetHeader>
              <nav
                className="flex h-dvh flex-col justify-center gap-6 px-6"
                role="navigation"
                aria-label="Mobil navigasjon"
              >
                {navigationLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-semibold"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Logo */}
          <div className="hidden md:block">
            <LathansLogo href="/" />
          </div>
        </div>

        {/* Mobile: Logo (Center) | Desktop: Navigation (Center) */}
        <div className="justify-self-center">
          {/* Mobile Logo */}
          <div className="md:hidden">
            <LathansLogo href="/" />
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex"
            role="navigation"
            aria-label="Hovednavigasjon"
          >
            <ul className="flex space-x-6" role="list">
              {navigationLinks.map((link) => (
                <li key={link.label} role="listitem">
                  <Link
                    href={link.href}
                    className="text-secondary-foreground hover:text-foreground focus:text-foreground focus:ring-primary rounded-sm px-2 py-1 text-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Both Mobile & Desktop: User Profile (Right) */}
        <div className="flex min-w-26 flex-col items-end justify-self-end">
          <User />
        </div>
      </div>
    </header>
  );
}
