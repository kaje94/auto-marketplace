import { getSession } from "@auth0/nextjs-auth0/edge";
import { EditProfileForm } from "@/components/Forms/Profile/EditProfileForm";
import { api } from "@/utils/api";

export default async function Page() {
    const session = await getSession();
    const profile = await api.getMyProfileDetails(session?.user?.sub!);

    return <EditProfileForm successRedirectPath="/dashboard/profile" userData={profile} />;
}
