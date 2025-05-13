import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function UserProfileButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const { data } = authClient.useSession();

  if (data) {
    return (
      <Button variant="secondary" onClick={handleSignOut}>
        {data.user.name}
      </Button>
    );
  }

  return (
    <Button asChild>
      <Link href="/onboarding">Prøv gratis</Link>
    </Button>
  );
}
