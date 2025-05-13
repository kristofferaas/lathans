"use client";

import Link from "next/link";
import { LathansLogo } from "./lathans-logo";
import { UserProfileButton } from "./user-profile-button";

export function Header() {
  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <LathansLogo href="/" />
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
        <UserProfileButton />
      </div>
    </header>
  );
}
