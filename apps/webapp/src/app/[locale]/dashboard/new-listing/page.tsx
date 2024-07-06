import { getSession } from "@auth0/nextjs-auth0";
import { getMyProfileAction } from "@/actions/profileActions";
import { getCanCreateListingAction } from "@/actions/userListingActions";
import { CreateListingForm } from "@/components/Forms/Listings/CreateListingForm";

export default async function Page() {
    const session = await getSession();
    const [profile, canCreate] = await Promise.all([getMyProfileAction(session?.user?.email!), getCanCreateListingAction(session?.user?.email!)]);
    return <CreateListingForm canCreate={canCreate} profile={profile} />;
}
