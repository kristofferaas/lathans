"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export function User() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Button>Prøv gratis</Button>;
  }

  return <UserButton />;
}
