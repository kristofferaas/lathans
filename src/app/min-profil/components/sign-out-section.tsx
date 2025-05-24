"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function SignOutSection() {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-4xl font-extrabold italic">Logg ut</h2>
      <div className="rounded-lg border p-4">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold">Logg ut av kontoen din</h3>
            <p className="text-muted-foreground text-sm">
              Du vil bli logget ut og sendt tilbake til forsiden.
            </p>
          </div>
          <div className="flex justify-start">
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? "Logger ut..." : "Logg ut"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
