import { getSession } from "@auth0/nextjs-auth0";
import { getMyProfileAction } from "@/actions/profileActions";
import { EditProfileForm } from "@/components/Forms/Profile/EditProfileForm";

export default async function Page() {
    const session = await getSession();
    const profile = await getMyProfileAction(session?.user?.email!);

    return <EditProfileForm successRedirectPath="/dashboard/profile" userData={profile} />;
}
