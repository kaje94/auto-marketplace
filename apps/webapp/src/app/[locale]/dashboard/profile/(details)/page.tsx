import { getSession } from "@auth0/nextjs-auth0";
import { getMyProfileAction } from "@/actions/profileActions";
import { ProfileDetails } from "@/components/Dashboard/DashboardProfile";

export default async function Page() {
    const session = await getSession();
    const profile = await getMyProfileAction(session?.user?.email!);

    return <ProfileDetails profile={profile} session={session} />;
}
