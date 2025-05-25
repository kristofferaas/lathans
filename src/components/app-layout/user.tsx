"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar } from "./avatar";

export function User() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <Button>Prøv gratis</Button>;
  }

  if (!isSignedIn) {
    return (
      <Button asChild>
        <Link href="/onboarding">Prøv gratis</Link>
      </Button>
    );
  }

  return <Avatar href="/min-profil" />;
}
