import { getSession } from "@auth0/nextjs-auth0";
import { ProfileDetails } from "@/components/DashboardProfile";
import { api } from "@/utils/api";

export default async function Page() {
    const session = await getSession();
    const profile = await api.getMyProfileDetails(session?.user?.sub!);

    return <ProfileDetails profile={profile} session={session} />;
}
