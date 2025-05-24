import { currentUser } from "@clerk/nextjs/server";
import { ProfileForm, ProfileFormSchema } from "./components/profile-form";
import { SignOutSection } from "./components/sign-out-section";
import { PageContent } from "@/components/app-layout/page-content";
import { Separator } from "@/components/ui/separator";

async function updateUser(user: ProfileFormSchema) {
  "use server";

  console.warn("Not implemented updateUser", user);
}

export default async function UserProfilePage() {
  const user = await currentUser();

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <PageContent className="flex flex-col gap-12">
      <ProfileForm
        value={{
          fullName: user.fullName ?? undefined,
          phoneNumber: user.phoneNumbers[0]?.phoneNumber ?? undefined,
          email: user.emailAddresses[0]?.emailAddress ?? undefined,
        }}
        action={updateUser}
      />
      <Separator />
      <SignOutSection />
    </PageContent>
  );
}
