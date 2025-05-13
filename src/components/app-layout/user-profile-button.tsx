import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

export function UserProfileButton() {
  const handleSignIn = async () => {
    await authClient.signIn.oauth2({
      providerId: "vipps",
      callbackURL: window.location.origin,
    });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  const { data } = authClient.useSession();

  if (data) {
    return (
      <Button variant="secondary" onClick={handleSignOut}>
        {data.user.name}
      </Button>
    );
  }

  return <Button onClick={handleSignIn}>Prøv gratis</Button>;
}
