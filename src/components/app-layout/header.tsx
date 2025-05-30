"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { LathansLogo } from "./lathans-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { href: "#", label: "Om Lathans" },
  { href: "#", label: "Ofte stilte spørsmål" },
  { href: "#", label: "Bank og sikkerhet" },
];

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 h-16 py-4 pr-2 pl-4 backdrop-blur transition-transform duration-300 ease-in-out md:px-8 md:py-6",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Logo (Left) */}
        <div className="min-w-26 justify-self-start">
          <LathansLogo href="/" />
        </div>

        {/* Desktop Navigation (Center) */}
        <div className="justify-self-center">
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

        {/* Mobile Hamburger Menu (Right) */}
        <div className="flex min-w-26 justify-end">
          <ProfileButton />
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
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
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
        </div>
      </div>
    </header>
  );
}

function ProfileButton() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <Button size="sm" disabled>
        Prøv gratis
      </Button>
    );
  }

  if (!isSignedIn) {
    return (
      <Button asChild size="sm">
        <Link href="/onboarding">Prøv gratis</Link>
      </Button>
    );
  }
  return (
    <Button variant="outline" size="sm">
      <Link href="/min-profil">Min profil</Link>
    </Button>
  );
}
