"use client";

import { UserButton, SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Button } from "../ui/button";

export function User() {
  return (
    <>
      <Unauthenticated>
        <SignInButton mode="modal">
          <Button>Prøv gratis</Button>
        </SignInButton>
      </Unauthenticated>
      <AuthLoading>
        <Button>Prøv gratis</Button>
      </AuthLoading>
      <Authenticated>
        <UserButton />
      </Authenticated>
    </>
  );
}
