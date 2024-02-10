import { getSession } from "@auth0/nextjs-auth0/edge";
import { ProfileDetails } from "@/components/Dashboard/DashboardProfile";
import { api } from "@/utils/api";

export default async function Page() {
    const session = await getSession();
    const profile = await api.getMyProfileDetails(session?.user?.sub!);

    return <ProfileDetails profile={profile} session={session} />;
}
