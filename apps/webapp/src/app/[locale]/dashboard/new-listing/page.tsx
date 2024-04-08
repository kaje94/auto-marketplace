import { getSession } from "@auth0/nextjs-auth0";
import { getMyProfileAction } from "@/actions/profileActions";
import { CreateListingForm } from "@/components/Forms/Listings/CreateListingForm";

export default async function Page() {
    const session = await getSession();
    const profile = await getMyProfileAction(session?.user?.email!);
    return <CreateListingForm profile={profile} />;
}
