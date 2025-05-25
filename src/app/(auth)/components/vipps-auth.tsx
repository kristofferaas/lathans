"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { VippsButton } from "./vipps-button";

export function VippsAuth() {
  const { isLoaded, signIn } = useSignIn();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isLoaded) return;

    setError(null);

    // Get the redirect URL from query parameters, fallback to "/"
    const redirectUrl = searchParams.get("redirect_url") || "/";

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_custom_vipps_test",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: redirectUrl,
      });
    } catch (err: unknown) {
      const errorMessage =
        (err as { errors?: Array<{ longMessage?: string }> })?.errors?.[0]
          ?.longMessage || "Vipps sign in failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="mx-auto my-14 flex max-w-2xl flex-col items-center justify-center gap-8 text-center">
      <h1 className="text-6xl font-bold italic">Logg inn</h1>
      <p className="text-xl font-normal">
        Logg inn trygt med Vipps – helt gratis. Dette sikrer både dine data og
        kontoen din. Ved å logge inn godtar du våre{" "}
        <Link href="#" className="underline underline-offset-2">
          vilkår
        </Link>
        .
      </p>

      {error && (
        <Alert
          variant="destructive"
          className="max-w-md border-red-200 bg-red-50"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form action={handleSubmit}>
        <VippsButton />
      </form>
    </div>
  );
}
